(ns particles.canvas
  "Canvas操作ユーティリティ")

(defn clear
  "キャンバス全体をクリア"
  [ctx width height]
  (.clearRect ctx 0 0 width height))

(defn draw-circle
  "円を描画"
  [ctx x y radius color & {:keys [alpha] :or {alpha 1}}]
  (set! (.-globalAlpha ctx) alpha)
  (set! (.-fillStyle ctx) color)
  (.beginPath ctx)
  (.arc ctx x y radius 0 (* 2 js/Math.PI))
  (.fill ctx)
  (set! (.-globalAlpha ctx) 1))

(defn draw-ring
  "リング（円の輪郭）を描画"
  [ctx x y radius color & {:keys [alpha line-width] :or {alpha 1 line-width 1}}]
  (set! (.-globalAlpha ctx) alpha)
  (set! (.-strokeStyle ctx) color)
  (set! (.-lineWidth ctx) line-width)
  (.beginPath ctx)
  (.arc ctx x y radius 0 (* 2 js/Math.PI))
  (.stroke ctx)
  (set! (.-globalAlpha ctx) 1))

(defn draw-line
  "線を描画"
  [ctx x1 y1 x2 y2 color & {:keys [alpha line-width] :or {alpha 1 line-width 1}}]
  (set! (.-globalAlpha ctx) alpha)
  (set! (.-strokeStyle ctx) color)
  (set! (.-lineWidth ctx) line-width)
  (.beginPath ctx)
  (.moveTo ctx x1 y1)
  (.lineTo ctx x2 y2)
  (.stroke ctx)
  (set! (.-globalAlpha ctx) 1))

(defn draw-star
  "星形を描画"
  [ctx cx cy radius points color & {:keys [alpha inner-ratio] :or {alpha 1 inner-ratio 0.4}}]
  (set! (.-globalAlpha ctx) alpha)
  (set! (.-strokeStyle ctx) color)
  (set! (.-lineWidth ctx) 1)
  (.beginPath ctx)
  (doseq [i (range (* points 2))]
    (let [angle (- (* (/ i (* points 2)) js/Math.PI 2) (/ js/Math.PI 2))
          r (if (even? i) radius (* radius inner-ratio))
          px (+ cx (* r (js/Math.cos angle)))
          py (+ cy (* r (js/Math.sin angle)))]
      (if (zero? i)
        (.moveTo ctx px py)
        (.lineTo ctx px py))))
  (.closePath ctx)
  (.stroke ctx)
  (set! (.-globalAlpha ctx) 1))
