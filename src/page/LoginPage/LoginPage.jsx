import React, { useState } from "react";
import {
    Box, Button, Heading, Text, VStack, Divider, Input, useToast
} from "@chakra-ui/react";

export default function LoginPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
    const toast = useToast();

    const handleLogin = () => {
        setTimeout(() => {
            setIsLoggedIn(true);
            toast({
                title: "로그인 성공!",
                description: "환영합니다!",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        }, 1000); // 가상 로그인
    };

    return (
        <Box position="relative">
            {/* ✅ 기존 페이지 콘텐츠 */}

            {/* ✅ 로그인 오버레이 (로그인 전까지만 보여짐) */}
            {!isLoggedIn && (
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    width="100vw"
                    height="100vh"
                    bg="rgba(0, 0, 0, 0.6)"
                    zIndex={9999}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <VStack spacing={6} p={8} bg="white" borderRadius="xl" boxShadow="xl" w="350px">
                        <Heading size="md">로그인</Heading>

                        <Button colorScheme="gray" w="100%">
                            GitHub로 로그인
                        </Button>

                        <Divider />

                        <Input placeholder="이메일" size="sm" />
                        <Input placeholder="비밀번호" type="password" size="sm" />

                        <Button colorScheme="blue" w="100%" onClick={handleLogin}>
                            이메일로 로그인
                        </Button>

                        <Text fontSize="sm">
                            계정이 없으신가요? <Button variant="link" size="sm">회원가입</Button>
                        </Text>
                    </VStack>
                </Box>
            )}
        </Box>
    );
}
