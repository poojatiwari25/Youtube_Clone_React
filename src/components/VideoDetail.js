import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Typography, Box, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { Videos, Loader } from "./";
import { fetchFromAPI } from "../utils/fetchFromAPI";

const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true); 

    fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
      .then((data) => {
        if (data?.items?.length) {
          setVideoDetail(data.items[0]);
        } else {
          console.error("No video detail found");
        }
      })
      .catch((error) => console.error("Error fetching video details:", error));

    fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
      .then((data) => {
        if (data?.items?.length) {
          setVideos(data.items);
        } else {
          console.error("No related videos found");
        }
      })
      .catch((error) => console.error("Error fetching related videos:", error))
      .finally(() => setLoading(false)); 
  }, [id]);

  if (loading) return <Loader />;

  if (!videoDetail?.snippet) {
    return (
      <Typography
        variant="h6"
        color="white"
        textAlign="center"
        mt={4}
      >
        Video not found. Please try again later.
      </Typography>
    );
  }

  const {
    snippet: { title, channelId, channelTitle },
    statistics: { viewCount, likeCount },
  } = videoDetail;

  return (
    <Box minHeight="95vh">
      <Stack direction={{ xs: "column", md: "row" }}>
        <Box flex={1}>
          <Box sx={{ width: "100%", position: "sticky", top: "86px" }}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              className="react-player"
              controls
            />
            <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
              {title}
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ color: "#fff" }}
              py={1}
              px={2}
            >
              <Link to={`/channel/${channelId}`}>
                <Typography
                  variant={{ sm: "subtitle1", md: "h6" }}
                  color="#fff"
                >
                  {channelTitle}
                  <CheckCircleIcon
                    sx={{ fontSize: "12px", color: "gray", ml: "5px" }}
                  />
                </Typography>
              </Link>
              <Stack direction="row" gap="20px" alignItems="center">
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {parseInt(viewCount).toLocaleString()} views
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {parseInt(likeCount).toLocaleString()} likes
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
        <Box
          px={2}
          py={{ md: 1, xs: 5 }}
          justifyContent="center"
          alignItems="center"
        >
          {videos?.length > 0 ? (
            <Videos videos={videos} direction="column" />
          ) : (
            <Typography color="white" textAlign="center" mt={4}>
              No related videos found.
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;
