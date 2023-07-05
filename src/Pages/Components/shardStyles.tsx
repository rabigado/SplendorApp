import { Colors } from 'react-native/Libraries/NewAppScreen'
import styled from 'styled-components/native'


{/* <Text
style={[
  styles.sectionTitle,
  {
    color: isDarkMode ? Colors.white : Colors.black,
  },
]}> */}
export const StyledText = styled.Text<{isDarkMode?:boolean}>`
    color: ${({isDarkMode})=> isDarkMode ? Colors.lighter : Colors.black}
`

export const SectionDescription = styled.Text`
    margin-top: 8px;
    font-size: 18px;
    font-weight: 400;
`