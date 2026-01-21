(ns particles.effects.psychedelic
  "サイケデリックエフェクト（Canvas版）
   宇宙的でスピリチュアルなヒッピーテイスト"
  (:require [particles.canvas :as canvas]))

(def cosmic-colors
  ["#E8B4D8" "#9B59B6" "#3498DB" "#1ABC9C" "#F39C12"
   "#E74C3C" "#F5E6D3" "#8E44AD" "#2ECC71" "#D4A574"])

(def lotus-colors
  ["#FFB6C1" "#DDA0DD" "#E6E6FA" "#B0E0E6" "#FFDAB9"])

(defn rand-color [colors]
  (nth colors (rand-int (count colors))))

(defn create-cosmic-ring [x y index]
  {:x x
   :y y
   :type :cosmic-ring
   :radius 30
   :color (nth cosmic-colors (mod index (count cosmic-colors)))
   :progress 0
   :max-progress 60
   :alpha 1
   :delay (* index 3)})

(defn create-lotus-petal [x y layer]
  {:x x
   :y y
   :type :lotus
   :radius (+ 40 (* layer 30))
   :petals (+ 6 (* layer 4))
   :color (nth cosmic-colors (mod (* layer 2) (count cosmic-colors)))
   :fill-color (nth lotus-colors (mod layer (count lotus-colors)))
   :progress 0
   :max-progress 80
   :alpha 1
   :rotation-dir (if (even? layer) 1 -1)
   :rotation-speed (/ 1 (+ 4 layer))})

(defn create-eye [x y]
  {:x x
   :y y
   :type :eye
   :radius 40
   :color "#E8B4D8"
   :progress 0
   :max-progress 70
   :alpha 1})

(defn create-confetti [x y canvas-width canvas-height]
  {:x (rand-int canvas-width)
   :y (- (rand-int 100))
   :type :confetti
   :width (+ 5 (rand-int 7))
   :height (+ 3 (rand-int 5))
   :color (rand-color (concat cosmic-colors lotus-colors))
   :progress 0
   :max-progress 100
   :alpha 1
   :fall-speed (+ 2 (rand-int 3))
   :sway-amount (+ 15 (rand-int 20))
   :canvas-height canvas-height})

(defn start-effect!
  [state x y is-boss]
  (let [canvas (:canvas @state)
        width (.-width canvas)
        height (.-height canvas)
        ring-count (if is-boss 20 14)
        lotus-count (if is-boss 5 4)
        confetti-count (if is-boss 40 25)
        rings (mapv #(create-cosmic-ring x y %) (range ring-count))
        lotuses (mapv #(create-lotus-petal x y %) (range lotus-count))
        confetti (mapv #(create-confetti x y width height) (range confetti-count))
        eye [(create-eye x y)]]
    (swap! state update :particles
           #(into % (concat eye lotuses rings confetti)))))

(defn ease-out-cubic [t]
  (- 1 (js/Math.pow (- 1 t) 3)))

(defn update-particle [p]
  (let [progress (inc (:progress p))
        max-prog (:max-progress p)
        delay (or (:delay p) 0)
        effective-progress (max 0 (- progress delay))
        t (/ effective-progress max-prog)
        alive? (< progress (+ max-prog delay))]
    (if alive?
      (assoc p
             :progress progress
             :alpha (if (> effective-progress 0)
                      (max 0 (- 1 (ease-out-cubic (min 1 t))))
                      0))
      nil)))

(defn update-particles [particles]
  (->> particles (map update-particle) (filter some?) vec))

(defn draw-lotus-petals
  "蓮の花びら描画"
  [ctx cx cy radius petals color fill-color alpha rotation]
  (set! (.-globalAlpha ctx) (* alpha 0.6))
  (set! (.-strokeStyle ctx) color)
  (set! (.-fillStyle ctx) fill-color)
  (set! (.-lineWidth ctx) 1)
  (doseq [i (range petals)]
    (let [angle (+ (- (* (/ i petals) js/Math.PI 2) (/ js/Math.PI 2)) rotation)
          tip-x (+ cx (* radius (js/Math.cos angle)))
          tip-y (+ cy (* radius (js/Math.sin angle)))
          ctrl1-angle (- angle 0.15)
          ctrl2-angle (+ angle 0.15)
          ctrl1-x (+ cx (* radius 0.3 (js/Math.cos ctrl1-angle)))
          ctrl1-y (+ cy (* radius 0.3 (js/Math.sin ctrl1-angle)))
          ctrl2-x (+ cx (* radius 0.3 (js/Math.cos ctrl2-angle)))
          ctrl2-y (+ cy (* radius 0.3 (js/Math.sin ctrl2-angle)))]
      (.beginPath ctx)
      (.moveTo ctx cx cy)
      (.quadraticCurveTo ctx ctrl1-x ctrl1-y tip-x tip-y)
      (.quadraticCurveTo ctx ctrl2-x ctrl2-y cx cy)
      (.fill ctx)
      (.stroke ctx)))
  (set! (.-globalAlpha ctx) 1))

(defn draw-particle
  [ctx {:keys [type x y radius color progress max-progress alpha
               delay petals fill-color rotation-dir rotation-speed
               width height fall-speed sway-amount canvas-height] :as p}]
  (let [delay-val (or delay 0)
        effective-progress (max 0 (- progress delay-val))
        t (min 1 (/ effective-progress max-progress))]
    (case type
      :cosmic-ring
      (when (> effective-progress 0)
        (let [scale (+ 1 (* t 8))]
          (canvas/draw-ring ctx x y (* radius scale) color
                            :alpha alpha :line-width (- 2 (* t 1.5)))))

      :lotus
      (let [rotation (* rotation-dir t rotation-speed js/Math.PI 2)
            scale (+ 0.8 (* (js/Math.sin (* t js/Math.PI 2)) 0.15))]
        (draw-lotus-petals ctx x y (* radius scale) petals color fill-color alpha rotation))

      :eye
      (let [pulse (+ 1 (* (js/Math.sin (* t js/Math.PI 4)) 0.2))]
        (canvas/draw-ring ctx x y (* radius pulse) color :alpha alpha :line-width 1)
        (canvas/draw-ring ctx x y (* radius 0.7 pulse) "#DDA0DD" :alpha (* alpha 0.6) :line-width 0.8)
        (canvas/draw-ring ctx x y (* radius 0.4 pulse) "#9B59B6" :alpha (* alpha 0.4) :line-width 0.5))

      :confetti
      (let [current-y (+ y (* fall-speed effective-progress))
            current-x (+ x (* sway-amount (js/Math.sin (* t js/Math.PI 4))))]
        (when (< current-y canvas-height)
          (set! (.-globalAlpha ctx) alpha)
          (set! (.-fillStyle ctx) color)
          (.fillRect ctx current-x current-y width height)
          (set! (.-globalAlpha ctx) 1)))

      nil)))
