import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import ScrollToTop from "./components/ScrollToTop";
import AdminRoute from "./components/AdminRoute";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CollectionsStorePage from "./pages/CollectionsStorePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import CheckoutCancelPage from "./pages/CheckoutCancelPage";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import CustomerRegisterPage from "./pages/CustomerRegisterPage";
import AccountPage from "./pages/AccountPage";
import CustomerOrdersPage from "./pages/CustomerOrdersPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import CategoriesPage from "./pages/CategoriesPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminCustomersPage from "./pages/AdminCustomersPage";
import ShowcasePage from "./pages/ShowcasePage";
import AdminOrderDetailPage from "./pages/AdminOrderDetailPage";

function App() {
  return (
    <CustomerAuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />

      <Routes>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/collections"
          element={<CollectionsStorePage />}
        />

        <Route
          path="/collections/:category"
          element={<CollectionsStorePage />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetailPage />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/contact"
          element={<ContactPage />}
        />

        <Route
          path="/cart"
          element={<CartPage />}
        />

        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />

        <Route
          path="/checkout/success"
          element={<CheckoutSuccessPage />}
        />

        <Route
          path="/checkout/cancel"
          element={<CheckoutCancelPage />}
        />

        <Route
          path="/login"
          element={<CustomerLoginPage />}
        />

        <Route
          path="/register"
          element={<CustomerRegisterPage />}
        />

        <Route
          path="/account"
          element={<AccountPage />}
        />

        <Route
          path="/orders"
          element={<CustomerOrdersPage />}
        />

        <Route
          path="/admin/login"
          element={<LoginPage />}
        />

        <Route
          path="/admin"
          element={<AdminRoute><DashboardPage /></AdminRoute>}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminRoute><DashboardPage /></AdminRoute>}
        />

        <Route
          path="/admin/products"
          element={<AdminRoute><ProductsPage /></AdminRoute>}
        />

        <Route
          path="/admin/categories"
          element={<AdminRoute><CategoriesPage /></AdminRoute>}
        />

        <Route
          path="/admin/showcase"
          element={<AdminRoute><ShowcasePage /></AdminRoute>}
        />

        <Route
          path="/admin/add-product"
          element={<AdminRoute><AddProductPage /></AdminRoute>}
        />

        <Route
          path="/admin/edit-product/:id"
          element={<AdminRoute><EditProductPage /></AdminRoute>}
        />

        <Route
          path="/admin/orders"
          element={<AdminRoute><AdminOrdersPage /></AdminRoute>}
        />

        <Route
          path="/admin/orders/:id"
          element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>}
        />

        <Route
          path="/admin/customers"
          element={<AdminRoute><AdminCustomersPage /></AdminRoute>}
        />

      </Routes>

        </BrowserRouter>
      </CartProvider>
    </CustomerAuthProvider>
  );
}

export default App;
