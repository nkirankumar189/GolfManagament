// CustomFlatList.js
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const CustomFlatList = ({ data, renderItem, keyExtractor, emptyListMessage,numColumns,onEndReached,onEndReachedThreshold, ...props }) => {
  return (
    <FlatList
      data={data}
      numColumns={numColumns}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListEmptyComponent={
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>{emptyListMessage || 'No items to display.'}</Text>
        </View>
      }
      {...props} // Spread any additional props passed to the component
    />
  );
};

const styles = StyleSheet.create({
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyListText: {
    fontSize: 16,
    color: '#888',
  },
});

export default CustomFlatList;