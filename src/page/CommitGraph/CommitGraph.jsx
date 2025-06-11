import React from "react";
import {Flex, Text, useToast} from "@chakra-ui/react";
import "./CommitGraph.css";

const branchColors = ["#fda189", "#e1aedc", "#797f98", "#748868", "#A833FF"];

export default function CommitGraph({
                                        branches = [],
                                        pullCommits = [],
                                    }) {
    const toast = useToast();

    const handleClick = (c) =>
        toast({title: "커밋", description: c.message, status: "info"});

    if (!branches.length) {
        return (
            <Flex justify="center" py={10} color="gray.400">
                그래프를 불러오는 중…
            </Flex>
        );
    }

    const formatDate = (c) => {
        const raw =
            c.committedAt      // 우리 코드가 원래 기대하던 이름
            ?? c.date          // 예전 구조
            ?? c.authorDate    // git log --format:%ai  로 뽑으면 이 이름
            ?? c.committerDate // simple-git 기본 포맷
            ?? c.timestamp;    // 혹시 timestamp 필드만 있을 때
        return raw ? new Date(raw).toLocaleString() : "";
    };

    return (
        <div className="graph-container">
            <div className="graph">
                {branches.map((branch, bIdx) => {
                    const pushed = branch.pushedCommits ?? [];

                    const pushedKeys = new Set(pushed.map((c) => c.id || c.hash));
                    const pullOnly =
                        branch.name === "main"
                            ? pullCommits.filter((c) => !pushedKeys.has(c.id || c.hash))
                            : [];

                    const allCommits = [...pushed, ...pullOnly];

                    return (
                        <div key={branch.name} className="branch">
                            <h3 style={{color: branchColors[bIdx % branchColors.length]}}>
                                {branch.name}
                            </h3>

                            <div className="commit-line">
                                {allCommits.length === 0 ? (
                                    <Text fontSize="sm" color="gray.500" py={4}>
                                        커밋 없음
                                    </Text>
                                ) : (
                                    allCommits.map((c, i) => (
                                        <React.Fragment key={c.id || c.hash}>
                                            <div
                                                className="commit"
                                                style={{
                                                    backgroundColor: branchColors[bIdx % branchColors.length],
                                                }}
                                                onClick={() => handleClick(c)}
                                            >
                                                <div>{c.message}</div>
                                                <div className="meta">{formatDate(c)}</div>
                                            </div>
                                            {i < allCommits.length - 1 && <div className="arrow">↓</div>}
                                        </React.Fragment>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
