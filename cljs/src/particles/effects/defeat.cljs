(ns particles.effects.defeat
  "敵撃破エフェクト（Canvas版）
   神聖幾何学的崩壊"
  (:require [particles.canvas :as canvas]))

(def normal-colors ["#888888" "#AAAAAA" "#666666" "#B0B0B0"])
(def elite-colors ["#FFD700" "#FFA500" "#FF8C00" "#FFDF00" "#E8B4D8"])
(def boss-colors ["#FFD700" "#FF6B6B" "#4ECDC4" "#9B59B6" "#E74C3C" "#F39C12"])

(defn get-colors [enemy-type]
  (case enemy-type
    :normal normal-colors
    :elite elite-colors
    :boss boss-colors
    normal-colors))

(defn rand-color [colors]
  (nth colors (rand-int (count colors))))

(defn create-fragment
  "飛散する幾何学フラグメント"
  [x y colors enemy-type]
  (let [angle (+ (* (rand) js/Math.PI 2) (- (rand) 0.5) 0.2)
        distance (+ 50 (rand-int (if (= enemy-type :boss) 100 70)))]
    {:x x
     :y y
     :type :fragment
     :angle angle
     :distance distance
     :size (+ 4 (rand-int 8))
     :sides (nth [3 4 5 6] (rand-int 4))
     :color (rand-color colors)
     :progress 0
     :max-progress (+ 40 (rand-int 20))
     :alpha 1
     :rotation-speed (- (rand) 0.5)}))

(defn create-particle [x y colors]
  {:x x
   :y y
   :type :particle
   :angle (+ (* (rand) js/Math.PI 2) (- (rand) 0.5) 0.3)
   :distance (+ 30 (rand-int 60))
   :radius (+ 1 (rand-int 3))
   :color (rand-color colors)
   :progress 0
   :max-progress (+ 30 (rand-int 15))
   :alpha 1})

(defn create-ring [x y index colors]
  {:x x
   :y y
   :type :ring
   :radius (+ 25 (* index 6))
   :color (nth colors (mod index (count colors)))
   :progress 0
   :max-progress (+ 40 (* index 8))
   :alpha 1
   :rotation-dir (if (even? index) 1 -1)})

(defn create-symbol [x y enemy-type]
  {:x x
   :y y
   :type :symbol
   :radius (case enemy-type :boss 18 :elite 12 8)
   :color (first (get-colors enemy-type))
   :progress 0
   :max-progress 50
   :alpha 1})

(defn start-effect!
  [state x y enemy-type]
  (let [colors (get-colors enemy-type)
        fragment-count (case enemy-type :boss 30 :elite 18 10)
        particle-count (case enemy-type :boss 40 :elite 25 12)
        ring-count (case enemy-type :boss 12 :elite 8 5)
        fragments (mapv #(create-fragment x y colors enemy-type) (range fragment-count))
        particles (mapv #(create-particle x y colors) (range particle-count))
        rings (mapv #(create-ring x y % colors) (range ring-count))
        symbol [(create-symbol x y enemy-type)]]
    (swap! state update :particles
           #(into % (concat symbol rings fragments particles)))))

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

(defn draw-polygon
  "多角形描画"
  [ctx cx cy radius sides color alpha rotation]
  (set! (.-globalAlpha ctx) alpha)
  (set! (.-strokeStyle ctx) color)
  (set! (.-lineWidth ctx) 1)
  (.beginPath ctx)
  (doseq [i (range sides)]
    (let [angle (+ (- (* (/ i sides) js/Math.PI 2) (/ js/Math.PI 2)) rotation)
          px (+ cx (* radius (js/Math.cos angle)))
          py (+ cy (* radius (js/Math.sin angle)))]
      (if (zero? i) (.moveTo ctx px py) (.lineTo ctx px py))))
  (.closePath ctx)
  (.stroke ctx)
  (set! (.-globalAlpha ctx) 1))

(defn draw-particle
  [ctx {:keys [type x y angle distance radius color progress max-progress alpha
               size sides rotation-speed rotation-dir] :as p}]
  (let [t (ease-out-cubic (/ progress max-progress))]
    (case type
      :fragment
      (let [current-x (+ x (* (js/Math.cos angle) distance t))
            current-y (+ y (* (js/Math.sin angle) distance t) -20)
            rotation (* rotation-speed t js/Math.PI 2)
            scale (- 1 (* t 0.5))]
        (draw-polygon ctx current-x current-y (* size scale) sides color alpha rotation))

      :particle
      (let [current-x (+ x (* (js/Math.cos angle) distance t))
            current-y (+ y (* (js/Math.sin angle) distance t))]
        (canvas/draw-circle ctx current-x current-y radius color :alpha alpha))

      :ring
      (let [scale (+ 1 (* t 2))
            rotation (* rotation-dir t 0.3)]
        (canvas/draw-ring ctx x y (* radius scale) color
                          :alpha alpha :line-width (- 1.5 t)))

      :symbol
      (let [scale (+ 0.5 (* t 1.5))]
        (draw-polygon ctx x y (* radius scale) 6 color alpha (* t js/Math.PI))
        (draw-polygon ctx x y (* radius scale 0.5) 6 color (* alpha 0.6) (* t js/Math.PI -0.5)))

      nil)))
