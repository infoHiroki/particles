import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';

// エフェクトをインポート
import { DamageEffectSvg } from '../DamageEffectSvg';
import { HealEffectSvg } from '../HealEffectSvg';
import { BlockEffectSvg } from '../BlockEffectSvg';
import { BuffEffectSvg } from '../BuffEffectSvg';
import { DebuffEffectSvg } from '../DebuffEffectSvg';
import { DefeatEffectSvg } from '../DefeatEffectSvg';
import { CardPlayEffectSvg } from '../CardPlayEffectSvg';
import { PsychedelicEffect } from '../PsychedelicEffect';

type EffectType =
  | 'damage'
  | 'heal'
  | 'block'
  | 'buff'
  | 'debuff'
  | 'defeat'
  | 'cardPlay'
  | 'psychedelic'
  | null;

const EFFECTS = [
  { id: 'damage', name: 'Damage', color: '#E74C3C' },
  { id: 'heal', name: 'Heal', color: '#2ECC71' },
  { id: 'block', name: 'Block', color: '#3498DB' },
  { id: 'buff', name: 'Buff', color: '#F39C12' },
  { id: 'debuff', name: 'Debuff', color: '#9B59B6' },
  { id: 'defeat', name: 'Defeat', color: '#1ABC9C' },
  { id: 'cardPlay', name: 'Card Play', color: '#E91E63' },
  { id: 'psychedelic', name: 'Psychedelic', color: '#FF6B6B' },
] as const;

const { width, height } = Dimensions.get('window');

export default function App() {
  const [activeEffect, setActiveEffect] = useState<EffectType>(null);
  const [effectKey, setEffectKey] = useState(0);

  const triggerEffect = (effect: EffectType) => {
    setActiveEffect(effect);
    setEffectKey(prev => prev + 1);
  };

  const handleComplete = () => {
    setActiveEffect(null);
  };

  const centerX = width / 2;
  const centerY = height / 2 - 50;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Particles Demo</Text>

      <View style={styles.stage}>
        <Text style={styles.stageText}>Tap a button to preview</Text>

        {activeEffect === 'damage' && (
          <DamageEffectSvg
            key={effectKey}
            damage={50}
            x={centerX}
            y={centerY}
            onComplete={handleComplete}
          />
        )}
        {activeEffect === 'heal' && (
          <HealEffectSvg
            key={effectKey}
            amount={30}
            x={centerX}
            y={centerY}
            onComplete={handleComplete}
          />
        )}
        {activeEffect === 'block' && (
          <BlockEffectSvg
            key={effectKey}
            amount={20}
            x={centerX}
            y={centerY}
            onComplete={handleComplete}
          />
        )}
        {activeEffect === 'buff' && (
          <BuffEffectSvg
            key={effectKey}
            x={centerX}
            y={centerY}
            onComplete={handleComplete}
          />
        )}
        {activeEffect === 'debuff' && (
          <DebuffEffectSvg
            key={effectKey}
            x={centerX}
            y={centerY}
            onComplete={handleComplete}
          />
        )}
        {activeEffect === 'defeat' && (
          <DefeatEffectSvg
            key={effectKey}
            x={centerX}
            y={centerY}
            onComplete={handleComplete}
          />
        )}
        {activeEffect === 'cardPlay' && (
          <CardPlayEffectSvg
            key={effectKey}
            x={centerX}
            y={centerY}
            onComplete={handleComplete}
          />
        )}
        {activeEffect === 'psychedelic' && (
          <PsychedelicEffect
            key={effectKey}
            onComplete={handleComplete}
          />
        )}
      </View>

      <ScrollView style={styles.buttonContainer} horizontal showsHorizontalScrollIndicator={false}>
        {EFFECTS.map((effect) => (
          <TouchableOpacity
            key={effect.id}
            style={[styles.button, { backgroundColor: effect.color }]}
            onPress={() => triggerEffect(effect.id as EffectType)}
          >
            <Text style={styles.buttonText}>{effect.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  stage: {
    flex: 1,
    backgroundColor: '#16213e',
    marginHorizontal: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  stageText: {
    color: '#4a5568',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
