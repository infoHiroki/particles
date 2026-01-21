(ns particles.effects.buff
  "バフエフェクト（Canvas版）
   上昇する光の柱"
  (:require [particles.canvas :as canvas]))

(def buff-colors
  ["#FFD700" "#F39C12" "#FFD93D" "#E67E22" "#FFF176"])

(defn rand-color [colors]
  (nth colors (rand-int (count colors))))

(defn create-rising-particle [x y]
  (let [angle (* (rand) js/Math.PI 2)
        radius (+ 40 (rand-int 30))]
    {:x (+ x (* (js/Math.cos angle) radius))
     :y y
     :type :rising
     :rise-height (+ 90 (rand-int 60))
     :radius (+ 2.5 (rand-int 3))
     :color (rand-color buff-colors)
     :progress 0
     :max-progress (+ 35 (rand-int 15))
     :alpha 1}))

(defn create-ring [x y index]
  {:x x
   :y y
   :type :ring
   :radius 50
   :height 17
   :color (nth buff-colors (mod index (count buff-colors)))
   :progress 0
   :max-progress (+ 30 (* index 5))
   :alpha 1
   :target-y (- -20 (* index 15))
   :scale (- 1 (* index 0.08))})

(defn create-ray [x y angle]
  {:x x
   :y y
   :type :ray
   :angle angle
   :length 70
   :color (rand-color buff-colors)
   :progress 0
   :max-progress 30
   :alpha 1})

(defn create-core [x y]
  {:x x
   :y y
   :type :core
   :radius 18
   :color "#FFD700"
   :progress 0
   :max-progress 40
   :alpha 1})

(defn start-effect!
  [state x y]
  (let [particle-count 20
        ring-count 6
        ray-count 8
        particles (mapv #(create-rising-particle x y) (range particle-count))
        rings (mapv #(create-ring x y %) (range ring-count))
        rays (mapv #(create-ray x y (* (/ % ray-count) js/Math.PI 2)) (range ray-count))
        core [(create-core x y)]]
    (swap! state update :particles
           #(into % (concat core rays rings particles)))))

(defn ease-out-cubic [t]
  (- 1 (js/Math.pow (- 1 t) 3)))

(defn update-particle [p]
  (let [progress (inc (:progress p))
        t (/ progress (:max-progress p))
        alive? (< progress (:max-progress p))]
    (if alive?
      (assoc p :progress progress :alpha (- 1 (ease-out-cubic t)))
      nil)))

(defn update-particles [particles]
  (->> particles (map update-particle) (filter some?) vec))

(defn draw-ellipse [ctx x y rx ry color alpha]
  (set! (.-globalAlpha ctx) alpha)
  (set! (.-strokeStyle ctx) color)
  (set! (.-lineWidth ctx) 1)
  (.beginPath ctx)
  (.ellipse ctx x y rx ry 0 0 (* 2 js/Math.PI))
  (.stroke ctx)
  (set! (.-globalAlpha ctx) 1))

(defn draw-particle
  [ctx {:keys [type x y radius color progress max-progress alpha
               rise-height height target-y scale angle length] :as p}]
  (let [t (ease-out-cubic (/ progress max-progress))]
    (case type
      :rising
      (let [current-y (- y (* rise-height t))]
        (canvas/draw-circle ctx x current-y
                            (* radius (- 1 (* t 0.3)))
                            color :alpha alpha))

      :ring
      (let [current-y (+ y (* target-y t))]
        (draw-ellipse ctx x current-y
                      (* radius scale) (* height scale)
                      color alpha))

      :ray
      (let [end-x (+ x (* (js/Math.cos angle) length t))
            end-y (+ y (* (js/Math.sin angle) length t) (* -50 t))]
        (canvas/draw-line ctx x y end-x end-y color
                          :alpha alpha :line-width (- 2 t)))

      :core
      (let [scale-val (+ 0.5 (* t 1.5))]
        (canvas/draw-circle ctx x y (* radius scale-val) color
                            :alpha (* alpha 0.7)))

      nil)))
