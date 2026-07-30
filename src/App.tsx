import { RouterProvider } from "react-router-dom";
import { router } from "@/app/routes";
console.log(import.meta.env.VITE_APP_NAME);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
