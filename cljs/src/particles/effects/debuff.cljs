(ns particles.effects.debuff
  "デバフエフェクト（Canvas版）
   下降する暗い柱"
  (:require [particles.canvas :as canvas]))

(def debuff-colors
  ["#9B59B6" "#8E44AD" "#C0392B" "#7D3C98" "#6C3483"])

(def dark-colors
  ["#2C3E50" "#1A1A2E" "#4A235A"])

(defn rand-color [colors]
  (nth colors (rand-int (count colors))))

(defn create-falling-particle [x y]
  (let [angle (* (rand) js/Math.PI 2)
        radius (+ 40 (rand-int 30))]
    {:x (+ x (* (js/Math.cos angle) radius))
     :y (- y 20)
     :type :falling
     :fall-height (+ 70 (rand-int 50))
     :radius (+ 2.5 (rand-int 3))
     :color (rand-color debuff-colors)
     :progress 0
     :max-progress (+ 35 (rand-int 15))
     :alpha 1}))

(defn create-ring [x y index]
  {:x x
   :y (- y 40)
   :type :ring
   :radius 50
   :height 17
   :color (nth debuff-colors (mod index (count debuff-colors)))
   :progress 0
   :max-progress (+ 30 (* index 5))
   :alpha 1
   :target-y (+ 10 (* index 12))
   :scale (+ 1 (* index 0.06))})

(defn create-line [x y angle]
  {:x x
   :y (- y 30)
   :type :line
   :angle angle
   :length 60
   :color (rand-color dark-colors)
   :progress 0
   :max-progress 30
   :alpha 1})

(defn create-aura [x y]
  {:x x
   :y y
   :type :aura
   :radius 23
   :color "#4A235A"
   :progress 0
   :max-progress 45
   :alpha 1})

(defn start-effect!
  [state x y]
  (let [particle-count 20
        ring-count 6
        line-count 8
        particles (mapv #(create-falling-particle x y) (range particle-count))
        rings (mapv #(create-ring x y %) (range ring-count))
        lines (mapv #(create-line x y (* (/ % line-count) js/Math.PI 2)) (range line-count))
        aura [(create-aura x y)]]
    (swap! state update :particles
           #(into % (concat aura lines rings particles)))))

(defn ease-in-cubic [t]
  (* t t t))

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
               fall-height height target-y scale angle length] :as p}]
  (let [t (ease-in-cubic (/ progress max-progress))]
    (case type
      :falling
      (let [current-y (+ y (* fall-height t))]
        (canvas/draw-circle ctx x current-y radius color :alpha alpha))

      :ring
      (let [current-y (+ y (* target-y t))
            t2 (ease-out-cubic (/ progress max-progress))]
        (draw-ellipse ctx x current-y
                      (* radius scale) (* height scale)
                      color alpha))

      :line
      (let [t2 (ease-out-cubic (/ progress max-progress))
            start-y (+ y (* 50 t))
            end-x (+ x (* (js/Math.cos angle) 25))
            end-y (+ start-y (* length t2))]
        (canvas/draw-line ctx (+ x (* (js/Math.cos angle) 25)) start-y
                          end-x end-y color
                          :alpha alpha :line-width (- 2 t2)))

      :aura
      (let [t2 (ease-out-cubic (/ progress max-progress))
            scale-val (+ 0.8 (* t2 0.5))]
        (canvas/draw-circle ctx x y (* radius scale-val) color
                            :alpha (* alpha 0.5))
        (canvas/draw-ring ctx x y (* radius 0.6) "#8E44AD"
                          :alpha (* alpha 0.4) :line-width 1))

      nil)))
