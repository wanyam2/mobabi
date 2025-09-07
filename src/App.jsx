// src/App.js
import React, { useEffect, useState } from "react";
import {
    ChakraProvider, Button, Center, Spinner, VStack, Input, Heading, HStack, useToast, Text
} from "@chakra-ui/react";
import BranchView from "./components/git/BranchView";
import Sidebar from "./components/layout/Sidebar";
import GitController from "./components/buttons/GitController";
import { api } from "./api";

const REPO_LS_KEY = "gitgui_repo_id";

function App() {
    const [projects, setProjects] = useState([
        {
            id: "proj-1",
            name: "My Repo",
            repoId: "", // ← 하드코딩 제거: 자동으로 채웁니다
            branches: [
                {
                    id: "main",
                    name: "main",
                    pushedCommits: [
                        { id: 1, message: "처음 커밋입니다!", committedAt: new Date().toISOString(), files: ["README.md"] },
                    ],
                },
                {
                    id: "feature/login",
                    name: "feature/login",
                    pushedCommits: [
                        { id: 2, message: "로그인 UI 개발", committedAt: new Date().toISOString(), files: ["Login.jsx"] },
                        { id: 3, message: "로그인 API 연동", committedAt: new Date().toISOString(), files: ["auth.js"] },
                    ],
                },
            ],
        },
    ]);

    const [pullCommits, setPullCommits] = useState([]);
    const [activeProjectId, setActiveProjectId] = useState("proj-1");

    // 로그인 상태
    const [authChecked, setAuthChecked] = useState(false);
    const [user, setUser] = useState(null);
    const toast = useToast();

    // 로그인 폼
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authLoading, setAuthLoading] = useState(false);

    // 자동 확보 진행 상태
    const [ensuringRepo, setEnsuringRepo] = useState(false);

    const activeProject = projects.find((p) => p.id === activeProjectId);
    const projectBranches = activeProject?.branches ?? [];
    const repoId = activeProject?.repoId || "";

    const setProjectBranches = (projectId, updater) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id !== projectId) return p;
                const nextBranches = typeof updater === "function" ? updater(p.branches) : updater;
                return { ...p, branches: nextBranches };
            })
        );
    };

    // 앱 시작 시 토큰 확인
    useEffect(() => {
        (async () => {
            try {
                if (api.auth.getToken()) {
                    const me = await api.user.me();
                    setUser(me);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setAuthChecked(true);
            }
        })();
    }, []);

    // ✅ 레포 아이디 자동 확보
    const ensureRepoId = async () => {
        if (!user) return;
        if (repoId) return;

        setEnsuringRepo(true);
        try {
            // 1) 서버에 레포가 이미 있다면 그걸 사용
            const list = await api.repos.list();
            const arr = Array.isArray(list) ? list : (list?.repos || list?.data || []);
            let id =
                arr?.[0]?.id || arr?.[0]?.repoId || arr?.[0]?.uuid || null;

            // 2) 없으면 새로 생성
            if (!id) {
                const created = await api.repos.create({});
                id = created?.id || created?.repoId || created?.uuid;
            }
            if (!id) throw new Error("레포 ID를 가져오지 못했습니다.");

            // 상태/로컬스토리지 반영
            setProjects((prev) =>
                prev.map((p) => (p.id === activeProjectId ? { ...p, repoId: id } : p))
            );
            try { localStorage.setItem(REPO_LS_KEY, id); } catch {}

            toast({ title: "Repo ID 확보", description: id, status: "success", duration: 1600 });
        } catch (e) {
            toast({ title: "Repo ID 확보 실패", description: e?.message || "요청 실패", status: "error" });
        } finally {
            setEnsuringRepo(false);
        }
    };

    // 로그인 완료 후 자동 확보 시도
    useEffect(() => {
        if (authChecked && user && !repoId && !ensuringRepo) {
            ensureRepoId();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authChecked, user, repoId]);

    // 회원가입
    const handleSignup = async () => {
        setAuthLoading(true);
        try {
            await api.auth.signup({ email, password });
            toast({ title: "회원가입 완료", status: "success" });
        } catch (e) {
            toast({ title: "회원가입 실패", description: e.message, status: "error" });
        } finally {
            setAuthLoading(false);
        }
    };

    // 로그인
    const handleSignin = async () => {
        setAuthLoading(true);
        try {
            await api.auth.signin({ email, password }); // token 저장
            const me = await api.user.me();             // 내 정보 확인
            setUser(me);
            toast({ title: "로그인 성공", status: "success" });
        } catch (e) {
            setUser(null);
            toast({ title: "로그인 실패", description: e.message, status: "error" });
        } finally {
            setAuthLoading(false);
        }
    };

    // 로그아웃
    const handleSignout = () => {
        api.auth.signout();
        setUser(null);
        toast({ title: "로그아웃", status: "info" });
    };

    // 초기 체크 로딩
    if (!authChecked) {
        return (
            <ChakraProvider>
                <Center h="100vh"><Spinner /></Center>
            </ChakraProvider>
        );
    }

    // 비로그인
    if (!user) {
        return (
            <ChakraProvider>
                <Center h="100vh">
                    <VStack spacing={4} w="320px">
                        <Heading size="md">로그인</Heading>
                        <Input placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <HStack w="100%" justify="space-between">
                            <Button onClick={handleSignup} variant="outline" isLoading={authLoading}>회원가입</Button>
                            <Button onClick={handleSignin} colorScheme="purple" isLoading={authLoading}>로그인</Button>
                        </HStack>
                    </VStack>
                </Center>
            </ChakraProvider>
        );
    }

    // 로그인 상태
    return (
        <ChakraProvider>
            <div className="App" style={{ display: "flex" }}>
                <Sidebar
                    projects={projects}
                    activeProjectId={activeProjectId}
                    onProjectClick={setActiveProjectId}
                    user={user}
                />
                <div className="main" style={{ flex: 1 }}>
                    <HStack style={{ justifyContent: "flex-end", padding: "8px 16px" }}>
                        <Button size="sm" onClick={handleSignout}>로그아웃</Button>
                    </HStack>

                    {ensuringRepo && !repoId && (
                        <Center py={3}>
                            <HStack><Spinner size="sm" /><Text>레포를 준비 중…</Text></HStack>
                        </Center>
                    )}

                    <BranchView branches={projectBranches} pullCommits={pullCommits} />
                    <GitController
                        projectId={repoId}
                        branches={projectBranches}
                        setBranches={(updater) => setProjectBranches(activeProjectId, updater)}
                        pullCommits={pullCommits}
                        setPullCommits={setPullCommits}
                    />
                </div>
            </div>
        </ChakraProvider>
    );
}

export default App;
