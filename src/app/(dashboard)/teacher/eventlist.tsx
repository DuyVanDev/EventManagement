const EventListTeacher = ({ data }: { data: any }) => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Danh sách sự kiện</h1>
      </div>
      {Array.isArray(data) &&
        data?.map((item, index) => {
          return (
            <div className="flex flex-col gap-4 mt-4" key={index}>
              <div className="bg-lamaSkyLight rounded-md p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">{item?.EventName}</h2>
                  <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                    {item?.StartTime}
                  </span>
                </div>
                <div
                  className="text-sm text-gray-400 mt-1 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: item?.EventDescription }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default EventListTeacher;
