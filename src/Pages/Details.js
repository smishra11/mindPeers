import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function Details() {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("postId");
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const fetchComments = () => {
    setLoading(true);
    axios
      .get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
      .then((res) => {
        setLoading(false);
        setComments(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (postId) {
      fetchComments(false);
    }
  }, []);

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h4" color="primary">
        <b>Post {postId}'s comments</b>
      </Typography>
      <Button
        variant="outlined"
        sx={{ mt: 2, textTransform: "none" }}
        onClick={() => navigate("/", { state: postId })}
      >
        Go back to posts
      </Button>
      <Box sx={{ py: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress thickness={5} />
          </Box>
        ) : comments && comments.length ? (
          <>
            {comments.map((data) => (
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }} key={data.id}>
                <Typography sx={{ mb: 1 }}>
                  <b>
                    {data.name} ({data.email})
                  </b>
                </Typography>
                <Typography color="textSecondary">{data.body}</Typography>
              </Paper>
            ))}
          </>
        ) : (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" align="center">
              No data found
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default Details;
