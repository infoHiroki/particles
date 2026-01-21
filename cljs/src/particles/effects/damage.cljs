(ns particles.effects.damage
  "ダメージエフェクト（Canvas版）
   ヒルマ・アフ・クリント風の幾何学的エネルギーバースト"
  (:require [particles.canvas :as canvas]))

;; カラーパレット
(def energy-colors
  ["#E74C3C" "#F39C12" "#9B59B6" "#E8B4D8"
   "#FF6B6B" "#FFD93D" "#1ABC9C" "#3498DB"])

(def impact-colors
  ["#FFD700" "#FF4500" "#DC143C" "#FF69B4" "#E8B4D8" "#9B59B6"])

(defn rand-color
  "ランダムにカラーを選択"
  [colors]
  (nth colors (rand-int (count colors))))

(defn create-particle
  "パーティクル生成"
  [x y type]
  (let [angle (* (rand) js/Math.PI 2)]
    {:x x
     :y y
     :type type
     :angle angle
     :distance (+ 40 (rand-int 80))
     :radius (+ 2 (rand-int 4))
     :color (rand-color energy-colors)
     :progress 0
     :max-progress (+ 30 (rand-int 20))
     :alpha 1}))

(defn create-ring
  "リングエフェクト生成"
  [x y index]
  {:x x
   :y y
   :type :ring
   :radius (+ 10 (* index 5))
   :color (nth impact-colors (mod index (count impact-colors)))
   :progress 0
   :max-progress (+ 25 (* index 5))
   :alpha 1})

(defn create-burst
  "放射線エフェクト生成"
  [x y angle]
  {:x x
   :y y
   :type :burst
   :angle angle
   :length (+ 30 (rand-int 40))
   :color (rand-color energy-colors)
   :progress 0
   :max-progress (+ 20 (rand-int 10))
   :alpha 1})

(defn create-star
  "中心シンボル（星形）生成"
  [x y damage]
  {:x x
   :y y
   :type :star
   :radius (if (>= damage 50) 20 15)
   :points (if (>= damage 50) 8 6)
   :color "#FFD700"
   :progress 0
   :max-progress 35
   :alpha 1
   :rotation 0})

(defn start-effect!
  "エフェクト開始"
  [state x y damage]
  (let [;; ダメージレベルに応じたパーティクル数
        particle-count (cond
                         (>= damage 80) 30
                         (>= damage 50) 20
                         (>= damage 25) 12
                         :else 8)
        ring-count (cond
                     (>= damage 50) 8
                     (>= damage 25) 5
                     :else 3)
        burst-count (cond
                      (>= damage 80) 24
                      (>= damage 50) 16
                      :else 10)
        ;; パーティクル生成
        particles (mapv #(create-particle x y :particle) (range particle-count))
        rings (mapv #(create-ring x y %) (range ring-count))
        bursts (mapv #(create-burst x y (* (/ % burst-count) js/Math.PI 2))
                     (range burst-count))
        star [(create-star x y damage)]]
    (swap! state update :particles
           #(into % (concat star rings bursts particles)))))

(defn ease-out-cubic
  "イージング関数（cubic out）"
  [t]
  (- 1 (js/Math.pow (- 1 t) 3)))

(defn update-particle
  "パーティクル状態更新"
  [p]
  (let [progress (inc (:progress p))
        t (/ progress (:max-progress p))
        alive? (< progress (:max-progress p))]
    (if alive?
      (assoc p
             :progress progress
             :alpha (- 1 (ease-out-cubic t)))
      nil)))

(defn update-particles
  "全パーティクル更新（削除も含む）"
  [particles]
  (->> particles
       (map update-particle)
       (filter some?)
       vec))

(defn draw-particle
  "パーティクル描画"
  [ctx {:keys [type x y angle distance radius color progress max-progress alpha
               length points rotation] :as p}]
  (let [t (ease-out-cubic (/ progress max-progress))]
    (case type
      :particle
      (let [current-x (+ x (* (js/Math.cos angle) distance t))
            current-y (+ y (* (js/Math.sin angle) distance t))]
        (canvas/draw-circle ctx current-x current-y
                            (* radius (- 1 (* t 0.5)))
                            color :alpha alpha))

      :ring
      (canvas/draw-ring ctx x y
                        (* radius (+ 1 (* t 2)))
                        color
                        :alpha alpha
                        :line-width (- 2 t))

      :burst
      (let [end-x (+ x (* (js/Math.cos angle) length t))
            end-y (+ y (* (js/Math.sin angle) length t))]
        (canvas/draw-line ctx x y end-x end-y color
                          :alpha alpha
                          :line-width (- 2 t)))

      :star
      (let [scale (+ 0.5 (* t 1.5))
            current-radius (* radius scale)]
        (canvas/draw-star ctx x y current-radius points color :alpha alpha))

      nil)))
