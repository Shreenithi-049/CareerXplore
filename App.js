import AppNavigator from "./src/navigation/AppNavigator";
import { ComparisonProvider } from "./src/context/ComparisonContext";

import 'react-native-reanimated';


export default function App() {
  return (
    <ComparisonProvider>
      <AppNavigator />
    </ComparisonProvider>
  );
}
