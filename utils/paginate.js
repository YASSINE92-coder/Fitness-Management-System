const paginate = async (model, page, limit, filters = {}) => {
  const startIndex = (page - 1) * limit;
  const records = await model.find(filters).limit(limit).skip(startIndex);

  const endIndex = page * limit;
  const data = {
    startIndex,
    endIndex,
    records,
    limit,
    page,
  };
  const total = await model.countDocuments(filters);
  data.total = total;
  data.totalPages = Math.ceil(total / limit);

  // Add next page if available
  if (endIndex < total) {
    data.next = {
      page: Number(page) + 1,
      limit,
    };
  }

  // Add previous page if available
  if (startIndex > 0) {
    data.previous = {
      page: Number(page) - 1,
      limit,
    };
  }

  return data;
};

export default paginate;
