import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  Link as ChakraLink,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  IconButton,
  Text,
} from "@chakra-ui/react";

import Link from "next/link";
import { CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import Account from "./Account";
import { useWeb3React } from "@web3-react/core";
import useEagerConnect from "../hooks/useEagerConnect";

import grassrootIcon from "../public/grassroot_full.png";
import Image from "next/image";
import ETHBalance from "./ETHBalance";
import { shortenHex } from "../util";
import Jdenticon from "react-jdenticon";

const NavLink = ({ children }: { children: ReactNode }) => (
  <ChakraLink
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </ChakraLink>
);

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

  const { account, library, deactivate } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} py={2} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Link href={`/`}>
            <Box
              backgroundColor={
                colorMode === "dark" ? "whiteAlpha.800" : "white"
              }
              borderColor={"darkgrey"}
              borderWidth={"1px"}
              borderRadius={10}
            >
              <Image
                src={grassrootIcon}
                alt={"Grassroot Icon"}
                width={170}
                height={60}
              />
            </Box>
          </Link>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Account triedToEagerConnect={triedToEagerConnect} />

              {isConnected && (
                <Menu>
                  {({ isOpen, onClose }) => (
                    <>
                      <MenuButton
                        as={Button}
                        rounded={"full"}
                        variant={"link"}
                        cursor={"pointer"}
                        minW={0}
                      >
                        {isOpen ? (
                          <IconButton
                            aria-label="close naivation menu"
                            onClick={onClose}
                          >
                            <CloseIcon />
                          </IconButton>
                        ) : (
                          <Jdenticon size={"30"} value={account ?? ""} />
                        )}
                      </MenuButton>
                      <MenuList alignItems={"center"}>
                        <br />
                        <Center>
                          <Link href={`/profile/${account}`}>
                            <Text>{account && shortenHex(account, 4)}</Text>
                          </Link>
                        </Center>
                        <br />
                        <MenuDivider />
                        <MenuItem>Your Profile</MenuItem>
                        <MenuItem>
                          <ETHBalance />
                        </MenuItem>
                        <MenuItem onClick={deactivate}>Logout</MenuItem>
                      </MenuList>
                    </>
                  )}
                </Menu>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
