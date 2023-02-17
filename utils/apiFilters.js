class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing fields from the query
    const removeFields = ["sort", "fields", "q", "limit", "page"];
    removeFields.forEach((ele) => delete queryCopy[ele]);
    //for each element remove it from the querycopy

    // console.log(queryCopy);

    //Advance filter using lt, lte, gt, gtw
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g, //regular expression
      (match) => `$${match}`
    );

    // console.log(queryStr);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      //by default sort by latest job at top i.e. postingDate
      this.query = this.query.sort("-postingDate");
    }

    return this;
  }

  limitFields() {
    //if you only want to see some particular fields
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  searchByQuery() {
    if (this.queryStr.q) {
      const qu = this.queryStr.q.split("-").join(" ");
      //because we can search java-developer as Java Developer
      //written in query string
      this.query = this.query.find({ $text: { $search: '"' + qu + '"' } });
    }

    return this;
  }

  pagination() {
    //?limit=20&page=5 i.e. 20 entries per page and 5th page
    // using base 10
    const page = parseInt(this.queryStr.page, 10) || 1;
    const limit = parseInt(this.queryStr.limit, 10) || 10;

    //default page is one and limit will be 10
    const skipResults = (page - 1) * limit;

    this.query = this.query.skip(skipResults).limit(limit);
    return this;
  }
}

module.exports = APIFilters;
