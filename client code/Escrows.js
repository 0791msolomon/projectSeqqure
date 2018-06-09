import React from "react";
import { Link } from "react-router-dom";
import * as escrowServices from "../services/escrow.service";
import Ribbon from "../components/Ribbon";
import EscrowEdit from "../components/EscrowEdit";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Notifier from "../helpers/notifier";
import PageHeader from "../components/PageHeader";
import Pagination from "react-js-pagination";
import { connect } from "react-redux";

class Escrows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      activeShow: false,
      escrows: true,
      update: false,
      create: false,
      openDate: null,
      openDateEnd: null,
      closeDateStart: null,
      closeDate: null,
      buyer: "",
      seller: "",
      propertyAddress: "",
      activePage: 1,
      itemsShown: 5
    };

    this.editItem = this.editItem.bind(this);
    this.cancel = this.cancel.bind(this);
    this.openDateChange = this.openDateChange.bind(this);
    this.openDateEndChange = this.openDateEndChange.bind(this);
    this.closeDateStartChange = this.closeDateStartChange.bind(this);
    this.closeDateChange = this.closeDateChange.bind(this);
    this.filterSearch = this.filterSearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  editItem = function(item, event) {
    event.preventDefault();
    this.setState({
      activeShow: !this.state.activeShow,
      formData: item,
      update: true,
      escrows: false
    });
  };
  cancel() {
    this.setState({
      activeShow: !this.state.activeShow,
      escrows: true,
      update: false,
      create: false
    });
  }
  openDateEndChange(date) {
    const value = date;
    this.setState({
      openDateEnd: value
    });
  }
  openDateChange(date) {
    const value = date;
    this.setState({
      openDate: value
    });
  }
  closeDateStartChange(date) {
    const value = date;
    this.setState({
      closeDateStart: value
    });
  }
  closeDateChange(date) {
    const value = date;
    this.setState({
      closeDate: value
    });
  }
  onChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  filterSearch(e) {
    e.preventDefault();
    this.setState({ activePage: 1 });
    const od = this.state.openDate;
    let open = null;
    if (od) {
      open = od.clone().format("YYYY-MM-DD");
    } else {
      open = "";
    }
    const ods = this.state.openDateEnd;
    let openEnd = null;
    if (ods) {
      openEnd = ods.clone().format("YYYY-MM-DD");
    } else {
      openEnd = "";
    }
    const cds = this.state.closeDateStart;
    let closeStart = null;
    if (cds) {
      closeStart = cds.clone().format("YYYY-MM-DD");
    } else {
      closeStart = "";
    }
    const cd = this.state.closeDate;
    let close = null;
    if (cd) {
      close = cd.clone().format("YYYY-MM-DD");
    } else {
      close = "";
    }

    escrowServices
      .search(
        1,
        this.state.itemsShown,
        this.state.propertyAddress,
        this.state.seller,
        this.state.buyer,
        open,
        close,
        openEnd,
        closeStart
      )
      .then(response => {
        this.setState({ files: response.item });
        Notifier.success("Updated Escrows List!");
      })
      .catch(err => {
        console.log(err);
      });
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => {
      const od = this.state.openDate;
      let open = null;
      if (od) {
        open = od.clone().format("YYYY-MM-DD");
      } else {
        open = "";
      }
      const ods = this.state.openDateEnd;
      let openEnd = null;
      if (ods) {
        openEnd = ods.clone().format("YYYY-MM-DD");
      } else {
        openEnd = "";
      }
      const cds = this.state.closeDateStart;
      let closeStart = null;
      if (cds) {
        closeStart = cds.clone().format("YYYY-MM-DD");
      } else {
        closeStart = "";
      }
      const cd = this.state.closeDate;
      let close = null;
      if (cd) {
        close = cd.clone().format("YYYY-MM-DD");
      } else {
        close = "";
      }

      escrowServices
        .search(
          this.state.activePage,
          this.state.itemsShown,
          this.state.propertyAddress,
          this.state.seller,
          this.state.buyer,
          open,
          close,
          openEnd,
          closeStart
        )
        .then(response => {
          this.setState({ files: response.item });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  componentDidMount() {
    escrowServices
      .itemCount()
      .then(response => {
        this.setState(
          {
            files: response.item.map(item => {
              return item;
            }),
            itemsCount: response.item.length
          },
          () => {
            escrowServices
              .search(
                this.state.activePage,
                this.state.itemsShown,
                this.state.propertyAddress,
                this.state.seller,
                this.state.buyer,
                "",
                "",
                "",
                ""
              )
              .then(response => {
                this.setState({ files: response.item });
                Notifier.success("Updated Escrows List!");
              })
              .catch(err => {
                console.log(err);
              });
          }
        );
      })
      .catch(error => {
        console.log(error);
      });
  }
  show = () => {
    this.setState({
      show: true
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.escrows && <Ribbon breadcrumbArray={["Escrows"]} />}
        {this.state.create && (
          <Ribbon breadcrumbArray={["Escrows", "Create"]} />
        )}
        {this.state.update && (
          <Ribbon breadcrumbArray={["Escrows", "Update"]} />
        )}

        <PageHeader
          iconClasses="fa fa-lg fa-fw fa-bank"
          title="Escrows"
          subtitle="Your Escrow Transactions"
        />
        <div id="content" className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div>
                {this.state.activeShow && (
                  <EscrowEdit
                    cancel={this.cancel}
                    formData={this.state.formData}
                  />
                )}
              </div>

              <div className="panel panel-info">
                {this.state.activeShow ? null : (
                  <div className="widget-body no-padding">
                    <form
                      action="php/demo-comment.php"
                      method="post"
                      id="comment-form"
                      className="smart-form"
                    >
                      <fieldset>
                        <div className="row">
                          <section className="col col-3">
                            <label className="input">
                              {" "}
                              <input
                                type="text"
                                name="propertyAddress"
                                placeholder="Property Address:"
                                value={this.state.propertyAddress}
                                onChange={this.onChange}
                              />
                            </label>
                          </section>
                          <section className="col col-3">
                            <label className="input">
                              {" "}
                              <i className="icon-append fa fa-user" />
                              <input
                                type="text"
                                name="buyer"
                                placeholder="Buyer Name:"
                                value={this.state.buyer}
                                onChange={this.onChange}
                              />
                            </label>
                          </section>
                          <section className="col col-3">
                            <label className="input">
                              {" "}
                              <i className="icon-append fa fa-user" />
                              <input
                                type="text"
                                name="seller"
                                placeholder="Seller Name:"
                                value={this.state.seller}
                                onChange={this.onChange}
                              />
                            </label>
                          </section>
                        </div>

                        <div className="row">
                          <section className="col col-2">
                            <span className="input">
                              <strong> Earliest Open Date</strong>
                              <DatePicker
                                name="openDate"
                                placeholderText="M/D/YYYY"
                                className="form-control"
                                selected={this.state.openDate}
                                onChange={this.openDateChange}
                              />
                            </span>
                          </section>
                          <section className="col col-2">
                            <span className="input">
                              {" "}
                              <strong> Latest Open Date</strong>
                              <DatePicker
                                name="openDateEnd"
                                placeholderText="M/D/YYYY"
                                className="form-control"
                                selected={this.state.openDateEnd}
                                onChange={this.openDateEndChange}
                              />
                            </span>
                          </section>
                          <section className="col col-2">
                            <span className="input">
                              {" "}
                              <strong> Earliest Close Date</strong>
                              <DatePicker
                                name="closeDateStart"
                                placeholderText="M/D/YYYY"
                                className="form-control"
                                selected={this.state.closeDateStart}
                                onChange={this.closeDateStartChange}
                              />
                            </span>
                          </section>
                          <section className="col col-2">
                            <span className="input">
                              {" "}
                              <strong>Latest Close Date</strong>
                              <DatePicker
                                name="closeDate"
                                placeholderText="M/D/YYYY"
                                className="form-control"
                                selected={this.state.closeDate}
                                onChange={this.closeDateChange}
                              />
                            </span>
                          </section>
                          <section className="col col-2">
                            <span>
                              {" "}
                              <button
                                style={{ marginTop: "11%" }}
                                name="closeDate"
                                placeholder="M/D/YYYY"
                                className="btn btn-success form-control"
                                onClick={this.filterSearch}
                              >
                                search properties{" "}
                              </button>
                            </span>
                          </section>
                        </div>
                      </fieldset>
                    </form>
                  </div>
                )}
                <div className="panel-heading">
                  Escrows
                  {!this.state.activeShow ? (
                    <button
                      className="btn btn-primary btn-xs pull-right "
                      id="createEscrow"
                      onClick={() =>
                        this.setState({
                          formData: {
                            openDate: new Date(moment()),
                            finalDate: "",
                            expectedCloseDate: ""
                          },
                          activeShow: !this.state.activeShow,
                          escrows: !this.state.escrows,
                          create: !this.state.create
                        })
                      }
                    >
                      Create New Escrow
                    </button>
                  ) : null}
                </div>
                <div className="panel-body status">
                  <ul className="comments">
                    {this.state.activeShow ? null : this.state.files.length >
                    0 ? (
                      this.state.files.map(item => {
                        item.buyers = [];
                        item.sellers = [];
                        for (let i = 0; i < item.people.length; i++) {
                          if (!item.people[i].person) {
                            continue;
                          }
                          if (item.people[i].securityRole.name === "Buyer") {
                            item.buyer =
                              item.people[i].person.firstName +
                              " " +
                              item.people[i].person.lastName;
                            item.buyers.push(item.buyer + ". ");
                          }
                          if (item.people[i].securityRole.name === "Seller") {
                            item.seller =
                              item.people[i].person.firstName +
                              " " +
                              item.people[i].person.lastName;
                            item.sellers.push(item.seller + ". ");
                          }
                        }

                        return (
                          <li key={item._id}>
                            <div>
                              <Link
                                to={`/escrows/${item._id}/dashboard/people`}
                              >
                                <strong>
                                  #{" " + item.escrowNumber + ": "}{" "}
                                </strong>
                                {item.street} {item.city}, {item.state}
                              </Link>
                            </div>
                            <div className="col col-12">
                              <p>
                                <strong>Buyer </strong>-{item.buyers.length > 0
                                  ? item.buyers
                                  : "Not Listed"}
                              </p>
                            </div>
                            <div className="col col-12">
                              <p>
                                {" "}
                                <strong>Seller </strong>-
                                {item.sellers.length > 0
                                  ? item.sellers
                                  : "Not Listed"}
                              </p>
                            </div>
                            <div>
                              <div className="col col-12">
                                {moment(item.openDate).format("ll") + " - "}
                                {item.expectedCloseDate
                                  ? moment(item.expectedCloseDate).format("ll")
                                  : "Invalid"}
                                <br />
                                <strong>
                                  {item.escrowStatus.toUpperCase()}
                                </strong>
                              </div>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <h1>No transactions listed</h1>
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {!this.state.activeShow ? (
            <div style={{ textAlign: "center" }}>
              <Pagination
                // hideDisabled
                prevPageText="prev"
                nextPageText="next"
                firstPageText="First"
                lastPageText="Last"
                activePage={this.state.activePage}
                onChange={this.handlePageChange}
                itemsCountPerPage={this.state.itemsShown}
                totalItemsCount={this.state.itemsCount}
                // pageRangeDisplayed={this.state.itemCount / this.state.itemsShown}
                // pageRangeDispalyed={"1"}
              />
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return { loginStatus: state.loginStatus };
};

export default connect(mapStateToProps)(Escrows);
