export default function pagination(data:{limit?:number , offset?:number}):string{
    let paginationStr:string = '';

    if (data.limit !== undefined) paginationStr += " LIMIT :limit ";
    if (data.offset !== undefined) paginationStr += " OFFSET :offset ";

    return paginationStr;
}