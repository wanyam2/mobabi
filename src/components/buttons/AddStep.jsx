import { useEffect, useMemo, useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import FileSelectModal from "../modals/FileSelectModal.jsx";
// 👇 토큰/BASE_URL/헤더 처리를 이미 포함한 공용 API 헬퍼를 사용합니다.
import { api } from "../../api/index"; // 경로는 프로젝트 구조에 맞게 조정

const fallbackDummy = Array.from({ length: 10 }, (_, i) => ({
    name: `test${i + 1}.ts`,
    status: (i + 1) % 2 === 0 ? "수정됨" : "추가됨",
}));

export default function AddStep({
                                    repoId,
                                    // accessToken은 이제 불필요하지만, 상위에서 내려오면 우선 적용 가능하게 유지
                                    accessToken,
                                    selectedFiles,
                                    setSelectedFiles,
                                    onComplete,
                                }) {
    const [isOpen, setIsOpen] = useState(false);
    const [fileOptions, setFileOptions] = useState(fallbackDummy);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    // api.auth.getToken()을 통한 단일 출처 토큰 관리
    const token = useMemo(() => accessToken ?? api.auth.getToken(), [accessToken]);

    const handleFileSelect = (fileName) => {
        setSelectedFiles((prev) =>
            prev.includes(fileName) ? prev.filter((f) => f !== fileName) : [...prev, fileName]
        );
    };

    const openModal = async () => {
        setIsOpen(true);
        if (!repoId) return;

        try {
            // ✅ 공용 헬퍼 사용 (토큰/BASE_URL/에러 처리 일원화)
            const data = await api.repos.status(repoId);
            const serverFiles = Array.isArray(data?.files) ? data.files : [];

            if (serverFiles.length === 0) {
                setFileOptions(fallbackDummy); // 개발 중엔 더미 표시
                toast({
                    title: "변경된 파일 없음",
                    description: "테스트용 더미 파일을 표시합니다.",
                    status: "info",
                    duration: 2000,
                    isClosable: true,
                });
                return;
            }

            const opts = serverFiles
                .map((f) => ({ name: f.path || f.name || "", status: f.status || "수정됨" }))
                .filter((f) => f.name);

            setFileOptions(opts.length ? opts : []);
        } catch (e) {
            // 네트워크/서버 오류 시 더미로 대체
            setFileOptions(fallbackDummy);
            toast({
                title: "상태 조회 실패",
                description: e?.message ?? "파일 상태 조회 중 오류가 발생했습니다.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const handleAdd = async () => {
        if (!repoId) {
            toast({ title: "설정 오류", description: "repoId가 없습니다.", status: "error", duration: 2000, isClosable: true });
            return;
        }
        if (!token) {
            toast({ title: "인증 필요", description: "로그인 후 다시 시도하세요.", status: "warning", duration: 2000, isClosable: true });
            return;
        }
        if (selectedFiles.length === 0) {
            toast({ title: "파일 선택 필요", description: "스테이징할 파일을 선택하세요.", status: "warning", duration: 2000, isClosable: true });
            return;
        }

        try {
            setIsSubmitting(true);
            // ✅ 공용 헬퍼 사용 → Authorization/BASE_URL 자동 처리
            const data = await api.repos.add(repoId, selectedFiles);

            toast({
                title: "Add 성공",
                description: `${data?.stagedFiles?.length ?? 0}개 파일이 스테이징 되었습니다.`,
                status: "success",
                duration: 2000,
                isClosable: true,
            });

            onComplete?.();
            setIsOpen(false);
        } catch (e) {
            // api.request 내부에서 401 시 토큰을 이미 clearToken() 함
            const status = e?.status;
            const msg = e?.message ?? "요청 처리 중 오류가 발생했습니다.";
            toast({
                title: status === 401 ? "인증 필요" : "Add 실패",
                description: msg,
                status: status === 401 ? "warning" : "error",
                duration: 2500,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        setSelectedFiles([]);
    }, [isOpen, setSelectedFiles]);

    return (
        <>
            <Button onClick={openModal} colorScheme="gray">Add</Button>
            <FileSelectModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                files={fileOptions}
                selectedFiles={selectedFiles}
                onSelect={handleFileSelect}
                onConfirm={handleAdd}
                isSubmitting={isSubmitting}
            />
        </>
    );
}
