import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import About from "@/components/Community/About";
import CreatePostLink from "@/components/Community/CreatePostLink";
import PageContent from "@/components/Layout/PageContent";
import Posts from "@/components/Posts/Posts";
import { Community, communityState } from "@/atoms/communitiesAtom";
import NotFound from "@/components/Community/NotFound";
import { useSetRecoilState } from "recoil";
import { auth, firestore } from "@/firebase/clientApp";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import safeJsonStringify from "safe-json-stringify";
import Header from "@/components/Community/Header";
import { Post } from "@/atoms/postsAtom";
import usePosts from "@/hooks/usePosts";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "@/components/Posts/PostItem";
import PostLoader from "@/components/Posts/PostLoader";

type SearchProps = { communityData: Community };

const Search: React.FC<SearchProps> = ({ communityData }) => {
  console.log("here is the data", communityData);
  const setCommunityStateValue = useSetRecoilState(communityState);

  const [searchWord, setSearchWord] = useState("");
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  } = usePosts();

  const arrayMaker = searchWord.split(" ");

  const getPosts = async () => {
    try {
      setLoading(true);
      //get posts for this community
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        where("title", ">=", arrayMaker[0]),
        where("title", "<=", arrayMaker[0] + "\uf8ff"),
        orderBy("title", "desc")
      );
      const postDocs = await getDocs(postsQuery);

      if (postDocs.empty) {
        console.log("No matching posts found");
      } else {
        console.log("Found matching posts:", postDocs.docs);
      }

      // Store in post state
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));

      console.log("posts", posts);
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, [communityData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(event.target.value.toString());
  };
  //Old Stuff before Posts import
  //Old Stuff before Posts import
  //Old Stuff before Posts import
  //Old Stuff before Posts import
  //Old Stuff before Posts import
  //Old Stuff before Posts import
  //Old Stuff before Posts import
  //Old Stuff before Posts import
  //Old Stuff before Posts import
  //Old Stuff before Posts import
  //Old Stuff before Posts import

  if (!communityData) {
    return <NotFound />;
  }

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, [communityData]);

  return (
    <>
      <>
        <InputGroup size="md">
          <Input
            borderRadius={40}
            borderColor="black"
            marginRight={40}
            marginLeft={40}
            marginTop={3}
            pr="4.5rem"
            placeholder="Search"
            bgColor="white"
            onChange={handleChange}
          />

          <Button
            height="35px"
            bgColor="black"
            position="relative"
            display={{ base: "none", sm: "flex" }}
            width="200px"
            mr={2}
            mt={4}
            size="md"
            onClick={getPosts}
          >
            Search
          </Button>
        </InputGroup>

        <PageContent>
          <>
            {loading ? (
              <PostLoader />
            ) : (
              <Stack>
                {postStateValue.posts.map((item) => (
                  <PostItem
                    key={item.id}
                    post={item}
                    userIsCreator={user?.uid === item.creatorId}
                    userVoteValue={
                      postStateValue.postVotes.find(
                        (vote) => vote.postId === item.id
                      )?.voteValue
                    }
                    onVote={onVote}
                    onSelectPost={onSelectPost}
                    onDeletePost={onDeletePost}
                    communityData={communityData}
                  />
                ))}
              </Stack>
            )}
          </>
          <>
            <About communityData={communityData} />
          </>
        </PageContent>
      </>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  //get community data and pass it to client

  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : "",
      },
    };
  } catch (error) {
    // cpild add error page here
    console.log("getServerSideProps error", error);
  }
}

export default Search;
