(ns particles.effects.block
  "ブロックエフェクト（Canvas版）
   六角形シールド"
  (:require [particles.canvas :as canvas]))

(def shield-colors
  ["#3498DB" "#5DADE2" "#85C1E9" "#AED6F1" "#1ABC9C"])

(defn rand-color [colors]
  (nth colors (rand-int (count colors))))

(defn create-particle [x y]
  {:x x
   :y y
   :type :particle
   :angle (* (rand) js/Math.PI 2)
   :distance (+ 50 (rand-int 60))
   :radius (+ 2 (rand-int 3))
   :color (rand-color shield-colors)
   :progress 0
   :max-progress (+ 25 (rand-int 15))
   :alpha 1})

(defn create-ring [x y index]
  {:x x
   :y y
   :type :ring
   :radius (+ 45 (* index 10))
   :height (+ 17 (* index 4))
   :color (nth shield-colors (mod index (count shield-colors)))
   :progress 0
   :max-progress (+ 30 (* index 5))
   :alpha 1
   :rise (* -8 index)})

(defn create-hexagon [x y block]
  {:x x
   :y y
   :type :hexagon
   :radius (cond (>= block 30) 50 (>= block 20) 40 (>= block 10) 35 :else 28)
   :color "#3498DB"
   :progress 0
   :max-progress 40
   :alpha 1})

(defn start-effect!
  [state x y block]
  (let [particle-count (cond (>= block 30) 20 (>= block 20) 16 (>= block 10) 12 :else 8)
        ring-count (cond (>= block 30) 6 (>= block 20) 5 (>= block 10) 4 :else 3)
        particles (mapv #(create-particle x y) (range particle-count))
        rings (mapv #(create-ring x y %) (range ring-count))
        hexagon [(create-hexagon x y block)]]
    (swap! state update :particles
           #(into % (concat hexagon rings particles)))))

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

(defn draw-hexagon
  "六角形描画"
  [ctx x y radius alpha]
  (set! (.-globalAlpha ctx) alpha)
  (set! (.-strokeStyle ctx) "#5DADE2")
  (set! (.-lineWidth ctx) 2)
  (.beginPath ctx)
  (doseq [i (range 6)]
    (let [angle (- (* (/ i 6) js/Math.PI 2) (/ js/Math.PI 2))
          px (+ x (* radius (js/Math.cos angle)))
          py (+ y (* radius (js/Math.sin angle)))]
      (if (zero? i)
        (.moveTo ctx px py)
        (.lineTo ctx px py))))
  (.closePath ctx)
  (.stroke ctx)
  ;; 内側リング
  (set! (.-lineWidth ctx) 1)
  (.beginPath ctx)
  (doseq [i (range 6)]
    (let [angle (- (* (/ i 6) js/Math.PI 2) (/ js/Math.PI 2))
          px (+ x (* (* radius 0.6) (js/Math.cos angle)))
          py (+ y (* (* radius 0.6) (js/Math.sin angle)))]
      (if (zero? i) (.moveTo ctx px py) (.lineTo ctx px py))))
  (.closePath ctx)
  (.stroke ctx)
  (set! (.-globalAlpha ctx) 1))

(defn draw-ellipse
  "楕円リング描画"
  [ctx x y rx ry color alpha]
  (set! (.-globalAlpha ctx) alpha)
  (set! (.-strokeStyle ctx) color)
  (set! (.-lineWidth ctx) 1)
  (.beginPath ctx)
  (.ellipse ctx x y rx ry 0 0 (* 2 js/Math.PI))
  (.stroke ctx)
  (set! (.-globalAlpha ctx) 1))

(defn draw-particle
  [ctx {:keys [type x y angle distance radius color progress max-progress alpha
               height rise] :as p}]
  (let [t (ease-out-cubic (/ progress max-progress))]
    (case type
      :particle
      (let [current-x (+ x (* (js/Math.cos angle) distance t))
            current-y (+ y (* (js/Math.sin angle) distance t) -15)]
        (canvas/draw-circle ctx current-x current-y radius color :alpha alpha))

      :ring
      (let [scale (+ 1 (* t 0.5))
            current-y (+ y (* rise t))]
        (draw-ellipse ctx x current-y
                      (* radius scale) (* height scale)
                      color alpha))

      :hexagon
      (let [scale (+ 0.5 (* t 1))]
        (draw-hexagon ctx x y (* radius scale) alpha))

      nil)))
