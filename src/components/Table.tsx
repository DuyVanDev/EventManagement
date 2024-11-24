const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <>
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data?.length > 0 && data?.map((item) => renderRow(item))}</tbody>
    </table>
    {data?.length <= 0 && <div className="text-gray-400 text-sm text-center mt-2">Không tìm thấy dữ liệu</div>}
    </>
  );
};

export default Table;
