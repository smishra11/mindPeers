import { Box, CircularProgress, Container, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [limit, setLimit] = useState(
    location.state ? Math.ceil(location.state / 5) * 5 : 5
  );

  const handlePosts = useCallback(() => {
    if (loadMore) return;

    setLoadMore(true);
    axios
      .get(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`)
      .then((res) => {
        setPosts(res.data);
        setLoadMore(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadMore(false);
      });
    setLimit(limit + 5);
  }, [limit, loadMore]);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      axios
        .get(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`)
        .then((res) => {
          setLoading(false);
          setPosts(res.data);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 15) {
        handlePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handlePosts]);

  useEffect(() => {
    if (location.state && posts && posts.length) {
      // const element = document.getElementById(`post_${location.state}`);
      // element.focus({ preventScroll: true });
      window.location.hash = `#post_${location.state}`;
    }
  }, [posts]);

  console.log(location.state);

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h4" color="primary">
        <b>Posts</b>
      </Typography>
      <Box sx={{ my: 3 }}>
        {loading ? (
          <Paper
            variant="outlined"
            sx={{
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <CircularProgress thickness={6} />
          </Paper>
        ) : posts && posts.length && !loading ? (
          <>
            {posts.map((data) => (
              <Paper
                id={"post_".concat(data.id)}
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 2,
                  ":hover": { background: "whitesmoke", cursor: "pointer" },
                  ":active": {
                    background: "#eee",
                  },
                }}
                key={data.id}
                onClick={() => navigate(`/comments?postId=${data.id}`)}
              >
                <Typography>
                  <b>{data.title} </b>
                </Typography>
                <Typography color="textSecondary">{data.body}</Typography>
              </Paper>
            ))}
            {loadMore && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 10,
                }}
              >
                <CircularProgress size={20} thickness={5} />
                <Typography color="primary" variant="h6" sx={{ ml: 1 }}>
                  Loading...
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="textSecondary" align="center">
              <b>No data found</b>
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default Home;
