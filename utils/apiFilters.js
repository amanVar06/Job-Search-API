class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing fields from the query
    const removeFields = ["sort", "fields"];
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
}

module.exports = APIFilters;
