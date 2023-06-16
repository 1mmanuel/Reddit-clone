import { Community } from "@/atoms/communitiesAtom";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { cp } from "fs";
import React from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import useCommunityData from "../../hooks/useCommunityData";

type HeaderProps = {
  communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  const { communityStateValue, onJoinOrLeaveCommunity, loading } =
    useCommunityData();

  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  ); //read from communitySnippets

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="black" />
      <Flex justifyContent="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {communityStateValue.currentCommunity?.imageURL ? (
            <Image
              borderRadius="full"
              boxSize="66px"
              src={communityStateValue.currentCommunity.imageURL}
              alt="Dan Abramov"
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
            />
          ) : (
            <Icon
              as={BsFillPlusCircleFill}
              fontSize={64}
              position="relative"
              top={-3}
              border="4px solid white"
              borderRadius="full"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {communityData.id}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                {communityData.id}
              </Text>
            </Flex>
            <Flex>
              <Button
                variant={isJoined ? "solid" : "solid"}
                height="30px"
                pr={6}
                pl={6}
                bgColor="black"
                isLoading={loading}
                onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
              >
                {isJoined ? "Joined" : "Join"}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;
