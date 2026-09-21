type Props = {
  colSpan: number;
  message: string;
};

/** 관리자 테이블 빈 목록 행 (나무말미와 동일) */
export function AdminEmptyTableRow({ colSpan, message }: Props) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-16 text-center text-[#6B6B6B]">
        {message}
      </td>
    </tr>
  );
}
