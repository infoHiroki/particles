(ns particles.effects.heal
  "回復エフェクト（Canvas版）
   上昇する癒しの光"
  (:require [particles.canvas :as canvas]))

(def heal-colors
  ["#2ECC71" "#58D68D" "#82E0AA" "#ABEBC6" "#E8B4D8" "#FFB6C1"])

(def sparkle-colors
  ["#FFFFFF" "#F0FFF0" "#FFE4E1"])

(defn rand-color [colors]
  (nth colors (rand-int (count colors))))

(defn create-rising-particle
  "上昇する光粒子"
  [x y]
  {:x (+ x (- (rand-int 140) 70))
   :y y
   :type :rising
   :rise-height (+ 100 (rand-int 80))
   :sway (- (rand-int 30) 15)
   :radius (+ 3 (rand-int 4))
   :color (rand-color heal-colors)
   :progress 0
   :max-progress (+ 40 (rand-int 20))
   :alpha 1})

(defn create-sparkle
  "キラキラ"
  [x y angle distance]
  {:x (+ x (* (js/Math.cos angle) distance))
   :y (+ y (* (js/Math.sin angle) distance) -20)
   :type :sparkle
   :size (+ 4 (rand-int 4))
   :color (rand-color sparkle-colors)
   :progress 0
   :max-progress 30
   :alpha 1})

(defn create-cross-symbol
  "十字シンボル"
  [x y]
  {:x x
   :y (- y 15)
   :type :cross
   :radius 20
   :color "#2ECC71"
   :progress 0
   :max-progress 40
   :alpha 1})

(defn start-effect!
  "エフェクト開始"
  [state x y heal]
  (let [particle-count (cond (>= heal 15) 24 (>= heal 8) 18 :else 12)
        sparkle-count (cond (>= heal 15) 12 (>= heal 8) 8 :else 6)
        particles (mapv #(create-rising-particle x y) (range particle-count))
        sparkles (mapv #(create-sparkle x y
                                        (* (/ % sparkle-count) js/Math.PI 2)
                                        (+ 50 (rand-int 40)))
                       (range sparkle-count))
        cross [(create-cross-symbol x y)]]
    (swap! state update :particles
           #(into % (concat cross sparkles particles)))))

(defn ease-out-cubic [t]
  (- 1 (js/Math.pow (- 1 t) 3)))

(defn update-particle [p]
  (let [progress (inc (:progress p))
        t (/ progress (:max-progress p))
        alive? (< progress (:max-progress p))]
    (if alive?
      (assoc p
             :progress progress
             :alpha (- 1 (ease-out-cubic t)))
      nil)))

(defn update-particles [particles]
  (->> particles
       (map update-particle)
       (filter some?)
       vec))

(defn draw-cross
  "十字を描画"
  [ctx x y size alpha]
  (let [arm (* size 0.4)
        width (* size 0.15)]
    (set! (.-globalAlpha ctx) alpha)
    (set! (.-fillStyle ctx) "#2ECC71")
    (.beginPath ctx)
    (.rect ctx (- x width) (- y arm) (* width 2) (* arm 2))
    (.rect ctx (- x arm) (- y width) (* arm 2) (* width 2))
    (.fill ctx)
    (set! (.-globalAlpha ctx) 1)))

(defn draw-particle
  [ctx {:keys [type x y radius color progress max-progress alpha
               rise-height sway size] :as p}]
  (let [t (ease-out-cubic (/ progress max-progress))]
    (case type
      :rising
      (let [current-y (- y (* rise-height t))
            current-x (+ x (* sway (js/Math.sin (* t js/Math.PI))))]
        (canvas/draw-circle ctx current-x current-y
                            (* radius (- 1 (* t 0.3)))
                            color :alpha alpha))

      :sparkle
      (let [scale (if (< t 0.5) (* t 2) (- 2 (* t 2)))]
        (canvas/draw-star ctx x y (* size scale) 4 color :alpha alpha))

      :cross
      (let [scale (+ 0.5 (* t 1.2))]
        (draw-cross ctx x y (* radius scale) alpha))

      nil)))
