export default function pagination(ignorePagination:boolean):string{
    return ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
}