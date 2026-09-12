import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RadioButton({ options, selectedOption, onSelect, horizontal = false, columns }) {
  return (
    <View style={[styles.wrapper, (horizontal || columns) && styles.horizontalWrapper]}>
      {options.map((opt) => (
        <TouchableOpacity 
          key={opt.value} 
          style={[
            styles.container, 
            horizontal && !columns && styles.horizontalContainer,
            columns && { width: `${100 / columns}%`, marginBottom: 16 }
          ]} 
          onPress={() => onSelect(opt.value)}
          activeOpacity={0.7}
        >
          <View style={[styles.outerCircle, selectedOption === opt.value && styles.selectedOuterCircle]}>
            {selectedOption === opt.value && <View style={styles.innerCircle} />}
          </View>
          <Text style={styles.label}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  horizontalWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  horizontalContainer: {
    marginRight: 16,
  },
  outerCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedOuterCircle: {
    borderColor: '#4CAF50',
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});