export function getStatusColor(status) {
    switch (status) {
        case '수정됨':
            return 'orange';
        case '추가됨':
            return 'green';
        default:
            return 'gray';
    }
}