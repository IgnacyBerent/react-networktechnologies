import LoginForm from './login-form/LoginForm';
import BookList from './books-page/book-list/BookList';
import HomePage from './home-page/HomePage';
import BookDetails from './books-page/book-details/BookDetails';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AboutPage from './about-page/AboutPage';
import MyLoans from './my-books/my-loans-page/MyLoansPage';
import ApiProvider from './api/ApiProvider';
import AddBook from './admin/AddBook';
import AddUser from './admin/AddUser';
import Users from './admin/users/Users';

function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/my_books" element={<MyLoans />} />
          <Route path="/bookDetail/:bookId" element={<BookDetails />} />
          <Route path="/admin/addBook" element={<AddBook />} />
          <Route path="/admin/addUser" element={<AddUser />} />
          <Route path="/admin/users" element={<Users />} />
        </Routes>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
