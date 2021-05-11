import authRoutes from "./auth/routes";
import searchRoutes from "./search/routes";
import topPlacesRoutes from "./topPlaces/routes";

export default [...searchRoutes, ...authRoutes, ...topPlacesRoutes];
