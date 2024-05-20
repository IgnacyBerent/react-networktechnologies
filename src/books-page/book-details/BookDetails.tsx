import './BookDetails.css';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { Rating } from '@mui/material';
import MenuAppBar from '../../app-bar/MenuAppBar';
import { useEffect, useState } from 'react';
import { useApi } from '../../api/ApiProvider';
import { BookDetailsDto } from '../../api/dto/book.dto';
import { ClientResponse } from '../../api/library-client';
import { BookDetailsGrid } from './BookDetailsGrid';
import Reviews from './Reviews';

function BookDetails() {
  const apiClient = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [bookDetails, setBookDetails] = useState<BookDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getBookDetails(Number(bookId))
      .then((response: ClientResponse<BookDetailsDto | null>) => {
        if (response.success) {
          setBookDetails(response.data);
        } else {
          if (response.statusCode === 401 || response.statusCode === 403) {
            navigate('/login', { state: { from: location, error: true } });
          } else {
            console.error('Failed to fetching details', response.statusCode);
          }
        }
        setLoading(false);
      });
  }, [navigate, location, apiClient, bookId]);

  if (loading || !bookDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MenuAppBar />
      <Box>
        <Grid container className="book-details-container">
          <Grid item xs={4} className="book-cover-container">
            <div className="book-cover-wrapper">
              <CardMedia
                component="img"
                image={bookDetails.img}
                className="book-cover"
              />
            </div>
          </Grid>
          <Grid item xs={8} className="book-details-card">
            <Card>
              <CardContent className="book-details-content">
                <Typography variant="h5" className="book-title">
                  {bookDetails.title}
                </Typography>
                <div className="rating-container">
                  Rating:{' '}
                  <Rating
                    name="read-only"
                    value={bookDetails.rating}
                    precision={0.1}
                    readOnly
                  />{' '}
                  {bookDetails.rating}/5 &nbsp;
                  <a href="#commentSection" className="review-link">
                    (
                    <span
                      style={{ textDecoration: 'underline', color: 'blue' }}
                    >
                      {bookDetails.ratingCount}
                    </span>
                    )
                  </a>
                </div>
                <hr />
                <Typography variant="body2" className="book-summary">
                  {bookDetails.summary}
                </Typography>
                <hr />
                <BookDetailsGrid bookDetails={bookDetails} />
                <Button
                  className="wide-button"
                  variant="contained"
                  sx={{
                    color: 'white',
                    backgroundColor: 'black',
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                  }}
                >
                  BORROW BOOK
                </Button>
              </CardContent>
            </Card>
            <div id="commentSection"></div>
          </Grid>
          <Reviews bookId={bookId!} />
        </Grid>
      </Box>
      <Outlet />
    </Box>
  );
}

export default BookDetails;
