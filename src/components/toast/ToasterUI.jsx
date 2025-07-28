import { useToast } from "@chakra-ui/react";

export default function useToaster() {
    const toast = useToast();

    const show = ({ title, description, status = "info", duration = 2000 }) => {
        toast({
            title,
            description,
            status,
            duration,
            isClosable: true,
        });
    };

    return show;
}