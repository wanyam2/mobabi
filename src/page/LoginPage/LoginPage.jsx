import React, { useEffect, useState } from "react";
import { Box, Button, VStack, Heading } from "@chakra-ui/react";

export default function LoginPage() {
    const handleGitHubLogin = () => {
        window.location.href = "http://localhost:4000/auth/github";
    };

    return (
        <Box position="relative" h="100vh" display="flex" alignItems="center" justifyContent="center">
            <VStack spacing={6} p={8} bg="white" borderRadius="xl" boxShadow="xl" w="350px">
                <Heading size="md">로그인</Heading>
                <Button colorScheme="gray" w="100%" onClick={handleGitHubLogin}>
                    GitHub로 로그인
                </Button>
            </VStack>
        </Box>
    );
}
