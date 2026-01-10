import { StyleSheet } from 'react-native';

export const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#000' : '#F4F5F6',
      flex: 1,
      overflowY: 'scroll',
      overflowX: 'hidden',
    },
    h1: {
      color: isDark ? '#fff' : '#000',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      
    },
    h3: {
      color: isDark ? '#fff' : '#000',
      fontFamily: 'sans-serif',
      textAlign:'left',
      marginLeft:20,

    },
    p: {
      color:'#737A87',
      fontFamily: 'sans-serif',
      textAlign:'center',
    },
  });