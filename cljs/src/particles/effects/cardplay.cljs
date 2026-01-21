(ns particles.effects.cardplay
  "カードプレイエフェクト（Canvas版）
   カードタイプ別の軽快なエフェクト"
  (:require [particles.canvas :as canvas]))

(def card-colors
  {:attack {:primary "#E74C3C" :secondary "#FF6B6B" :light "#FADBD8"}
   :defense {:primary "#3498DB" :secondary "#5DADE2" :light "#D6EAF8"}
   :skill {:primary "#2ECC71" :secondary "#58D68D" :light "#D5F5E3"}})

(defn get-colors [card-type]
  (get card-colors card-type (:skill card-colors)))

(defn create-particle [x y colors]
  (let [angle (* (rand) js/Math.PI 2)]
    {:x x
     :y y
     :type :particle
     :angle angle
     :distance (+ 45 (rand-int 35))
     :radius (+ 2 (rand-int 3))
     :color (:secondary colors)
     :progress 0
     :max-progress (+ 25 (rand-int 15))
     :alpha 1}))

(defn create-ray [x y angle colors]
  {:x x
   :y y
   :type :ray
   :angle angle
   :length 60
   :color (:secondary colors)
   :progress 0
   :max-progress 25
   :alpha 1})

(defn create-ring [x y colors]
  {:x x
   :y y
   :type :ring
   :radius 22
   :color (:primary colors)
   :progress 0
   :max-progress 30
   :alpha 1})

(defn create-flash [x y colors]
  {:x x
   :y y
   :type :flash
   :radius 18
   :color (:light colors)
   :progress 0
   :max-progress 35
   :alpha 1})

(defn start-effect!
  [state x y card-type]
  (let [colors (get-colors card-type)
        particle-count 14
        ray-count 10
        particles (mapv #(create-particle x y colors) (range particle-count))
        rays (mapv #(create-ray x y (* (/ % ray-count) js/Math.PI 2) colors) (range ray-count))
        ring [(create-ring x y colors)]
        flash [(create-flash x y colors)]]
    (swap! state update :particles
           #(into % (concat flash ring rays particles)))))

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

(defn draw-particle
  [ctx {:keys [type x y angle distance radius color progress max-progress alpha
               length] :as p}]
  (let [t (ease-out-cubic (/ progress max-progress))]
    (case type
      :particle
      (let [current-x (+ x (* (js/Math.cos angle) distance t))
            current-y (+ y (* (js/Math.sin angle) distance t))]
        (canvas/draw-circle ctx current-x current-y radius color :alpha alpha))

      :ray
      (let [end-x (+ x (* (js/Math.cos angle) length t))
            end-y (+ y (* (js/Math.sin angle) length t))]
        (canvas/draw-line ctx x y end-x end-y color
                          :alpha alpha :line-width (- 1.5 t)))

      :ring
      (let [scale (+ 0.5 (* t 1.5))]
        (canvas/draw-ring ctx x y (* radius scale) color
                          :alpha alpha :line-width (- 1 (* t 0.5))))

      :flash
      (let [scale (if (< t 0.3) (* t 3.3) (+ 1 (* (- t 0.3) 0.5)))]
        (canvas/draw-circle ctx x y (* radius scale) color
                            :alpha (* alpha (if (< t 0.3) 1 (- 1 (* (- t 0.3) 1.4))))))

      nil)))
