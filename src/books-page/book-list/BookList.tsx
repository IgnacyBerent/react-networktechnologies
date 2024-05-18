import { Box } from '@mui/material';
import MenuAppBar from '../../app-bar/MenuAppBar';
import BookItem from '../book-item/BookItem';
import './BookList.css';

import { Outlet } from 'react-router-dom';
import { useApi } from '../../api/ApiProvider';
import { useEffect, useState, useRef, useCallback } from 'react';
import { GetBooksPageDto } from '../../api/dto/book-page.dto';
import { ClientResponse } from '../../api/library-client';

function BookList() {
  const apiClient = useApi();
  const [books, setBooks] = useState<GetBooksPageDto | null>(null);
  const [page, setPage] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastBookElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && books?.hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [books],
  );

  useEffect(() => {
    const fetchBooks = async () => {
      const response: ClientResponse<GetBooksPageDto | null> =
        await apiClient.getBooks(page);
      if (response.success) {
        setBooks((prevBooks) => {
          const newBooks =
            page > 0
              ? [...(prevBooks?.books || []), ...response.data!.books]
              : response.data!.books;
          return {
            ...response.data,
            books: newBooks,
            currentPage: response.data!.currentPage || 0,
            totalPages: response.data!.totalPages || 0,
            totalItems: response.data!.totalItems || 0,
            hasMore: response.data!.hasMore || false,
          };
        });
      } else {
        console.error('Error during fetching books');
      }
    };

    fetchBooks();
  }, [apiClient, page]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MenuAppBar />
      <Box>
        <div className="book-list">
          {books?.books.map((book, index) => {
            if (books.books.length === index + 1) {
              return (
                <BookItem
                  ref={lastBookElementRef}
                  key={index}
                  id={book.id}
                  img={book.img}
                  title={book.title}
                  author={book.author}
                  rating={book.rating}
                />
              );
            } else {
              return (
                <BookItem
                  key={index}
                  id={book.id}
                  img={book.img}
                  title={book.title}
                  author={book.author}
                  rating={book.rating}
                />
              );
            }
          })}
        </div>
      </Box>
      <Outlet />
    </Box>
  );
}

export default BookList;
