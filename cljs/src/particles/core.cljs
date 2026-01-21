(ns particles.core
  "パーティクルシステム エントリポイント"
  (:require [particles.canvas :as canvas]
            [particles.effects.damage :as damage]
            [particles.effects.heal :as heal]
            [particles.effects.block :as block]
            [particles.effects.buff :as buff]
            [particles.effects.debuff :as debuff]
            [particles.effects.defeat :as defeat]
            [particles.effects.cardplay :as cardplay]
            [particles.effects.psychedelic :as psychedelic]))

;; 状態管理
(defonce state (atom {:canvas nil
                      :ctx nil
                      :particles []
                      :current-effect :damage
                      :auto-mode false
                      :auto-interval nil}))

;; エフェクト選択
(defn ^:export select-effect [effect-name]
  (swap! state assoc :current-effect (keyword effect-name))
  (js/console.log (str "Selected: " effect-name)))

(defn random-pos
  "キャンバス中央付近のランダム位置"
  []
  (let [{:keys [canvas]} @state
        width (.-width canvas)
        height (.-height canvas)]
    {:x (+ (/ width 2) (- (rand-int 100) 50))
     :y (+ (/ height 2) (- (rand-int 50) 25))}))

;; エフェクトトリガー関数
(defn ^:export trigger-damage []
  (let [{:keys [x y]} (random-pos)]
    (damage/start-effect! state x y (+ 10 (rand-int 90)))))

(defn ^:export trigger-heal []
  (let [{:keys [x y]} (random-pos)]
    (heal/start-effect! state x y (+ 5 (rand-int 20)))))

(defn ^:export trigger-block []
  (let [{:keys [x y]} (random-pos)]
    (block/start-effect! state x y (+ 5 (rand-int 35)))))

(defn ^:export trigger-buff []
  (let [{:keys [x y]} (random-pos)]
    (buff/start-effect! state x y)))

(defn ^:export trigger-debuff []
  (let [{:keys [x y]} (random-pos)]
    (debuff/start-effect! state x y)))

(defn ^:export trigger-defeat []
  (let [{:keys [x y]} (random-pos)
        enemy-type (rand-nth [:normal :elite :boss])]
    (defeat/start-effect! state x y enemy-type)))

(defn ^:export trigger-cardplay []
  (let [{:keys [x y]} (random-pos)
        card-type (rand-nth [:attack :defense :skill])]
    (cardplay/start-effect! state x y card-type)))

(defn ^:export trigger-psychedelic []
  (let [{:keys [x y]} (random-pos)]
    (psychedelic/start-effect! state x y (> (rand) 0.5))))

(defn ^:export clear-canvas []
  (let [{:keys [ctx canvas]} @state]
    (canvas/clear ctx (.-width canvas) (.-height canvas))
    (swap! state assoc :particles [])))

;; ランダムエフェクト発動
(def all-effects [:damage :heal :block :buff :debuff :defeat :cardplay :psychedelic])

(defn trigger-random []
  (let [{:keys [canvas]} @state
        width (.-width canvas)
        height (.-height canvas)
        x (+ 100 (rand-int (- width 200)))
        y (+ 100 (rand-int (- height 200)))
        effect (rand-nth all-effects)]
    (case effect
      :damage (damage/start-effect! state x y (+ 10 (rand-int 90)))
      :heal (heal/start-effect! state x y (+ 5 (rand-int 20)))
      :block (block/start-effect! state x y (+ 5 (rand-int 35)))
      :buff (buff/start-effect! state x y)
      :debuff (debuff/start-effect! state x y)
      :defeat (defeat/start-effect! state x y (rand-nth [:normal :elite :boss]))
      :cardplay (cardplay/start-effect! state x y (rand-nth [:attack :defense :skill]))
      :psychedelic (psychedelic/start-effect! state x y (> (rand) 0.5))
      nil)))

(defn ^:export start-auto []
  (when-not (:auto-mode @state)
    (let [interval-id (js/setInterval trigger-random 300)]
      (swap! state assoc :auto-mode true :auto-interval interval-id)
      (js/console.log "Auto mode started"))))

(defn ^:export stop-auto []
  (when (:auto-mode @state)
    (js/clearInterval (:auto-interval @state))
    (swap! state assoc :auto-mode false :auto-interval nil)
    (js/console.log "Auto mode stopped")))

(defn ^:export toggle-auto []
  (if (:auto-mode @state)
    (stop-auto)
    (start-auto)))

;; 時間倍率（大きいほど長く表示）
(def time-scale 2.5)

;; 汎用パーティクル更新（全エフェクト共通のease-out-cubic使用）
(defn ease-out-cubic [t]
  (- 1 (js/Math.pow (- 1 t) 3)))

(defn update-particle [p]
  (let [progress (+ (:progress p) (/ 1 time-scale))
        max-prog (:max-progress p)
        delay-val (/ (or (:delay p) 0) time-scale)
        effective-progress (max 0 (- progress delay-val))
        t (/ effective-progress max-prog)
        alive? (< progress (+ max-prog delay-val))]
    (if alive?
      (assoc p
             :progress progress
             :alpha (if (> effective-progress 0)
                      (max 0 (- 1 (ease-out-cubic (min 1 t))))
                      0))
      nil)))

(defn update-all-particles [particles]
  (->> particles
       (map update-particle)
       (filter some?)
       vec))

;; 描画ディスパッチ
(defn draw-particle [ctx p]
  (case (:type p)
    ;; Damage
    (:particle :ring :burst :star)
    (damage/draw-particle ctx p)

    ;; Heal
    (:rising :sparkle :cross)
    (heal/draw-particle ctx p)

    ;; Block
    (:hexagon)
    (block/draw-particle ctx p)

    ;; Buff
    (:core :ray)
    (buff/draw-particle ctx p)

    ;; Debuff
    (:falling :line :aura)
    (debuff/draw-particle ctx p)

    ;; Defeat
    (:fragment :symbol)
    (defeat/draw-particle ctx p)

    ;; CardPlay
    (:flash)
    (cardplay/draw-particle ctx p)

    ;; Psychedelic
    (:cosmic-ring :lotus :eye :confetti)
    (psychedelic/draw-particle ctx p)

    ;; 汎用（複数エフェクトで共有される型）
    (cond
      ;; particleは複数エフェクトで使用
      (= (:type p) :particle)
      (damage/draw-particle ctx p)

      ;; ringは複数エフェクトで使用
      (= (:type p) :ring)
      (if (:height p)
        (block/draw-particle ctx p)  ; 楕円リング
        (damage/draw-particle ctx p)) ; 円リング

      :else nil)))

(defn animation-loop []
  (let [{:keys [ctx canvas particles]} @state]
    (when (seq particles)
      (canvas/clear ctx (.-width canvas) (.-height canvas))
      (let [updated (update-all-particles particles)]
        (doseq [p updated]
          (draw-particle ctx p))
        (swap! state assoc :particles updated)))
    (js/requestAnimationFrame animation-loop)))

(defn trigger-at-position
  "指定位置でエフェクト発動"
  [x y]
  (case (:current-effect @state)
    :damage (damage/start-effect! state x y (+ 10 (rand-int 90)))
    :heal (heal/start-effect! state x y (+ 5 (rand-int 20)))
    :block (block/start-effect! state x y (+ 5 (rand-int 35)))
    :buff (buff/start-effect! state x y)
    :debuff (debuff/start-effect! state x y)
    :defeat (defeat/start-effect! state x y (rand-nth [:normal :elite :boss]))
    :cardplay (cardplay/start-effect! state x y (rand-nth [:attack :defense :skill]))
    :psychedelic (psychedelic/start-effect! state x y (> (rand) 0.5))
    ;; デフォルト
    (damage/start-effect! state x y (+ 10 (rand-int 90)))))

(defn on-canvas-click [e]
  (let [canvas (:canvas @state)
        rect (.getBoundingClientRect canvas)
        x (- (.-clientX e) (.-left rect))
        y (- (.-clientY e) (.-top rect))]
    (trigger-at-position x y)))

(defn ^:export init []
  (let [canvas (js/document.getElementById "canvas")
        ctx (.getContext canvas "2d")]
    (reset! state {:canvas canvas
                   :ctx ctx
                   :particles []})
    (.addEventListener canvas "click" on-canvas-click)
    (animation-loop)
    (js/console.log "Particles ClojureScript initialized with all effects!")))
