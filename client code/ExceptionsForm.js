import React from "react";
import * as exceptionServices from "../services/exception.service";
import moment from "moment";
import Ribbon from "../components/Ribbon";
import Notifier from "../helpers/notifier";
import PageHeader from "../components/PageHeader";
import Pagination from "react-js-pagination";

import { Modal, Button, FormGroup, Checkbox } from "react-bootstrap";

class ExceptionsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      activeItem: {},
      showCompose: false,
      modalShow: false,
      activePage: 1,
      itemsShown: 10,
      tenantName: "",
      statusCode: "",
      userName: ""
    };
    this.showItem = this.showItem.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateReview = this.updateReview.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  componentDidMount() {
    exceptionServices
      .getAll(
        this.state.activePage,
        this.state.itemsShown,
        this.state.tenantName,
        this.state.statusCode,
        this.state.userName
      )
      .then(response => {
        this.setState({
          items: response.items.map(item => {
            return item;
          })
        });
      })
      .catch(err => {
        console.log(err);
      });
    exceptionServices
      .getItemsCount(
        this.state.tenantName,
        this.state.userName,
        this.state.statusCode
      )
      .then(response => {
        this.setState({
          itemCount: response.items.length
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onChange(event) {
    this.setState(
      {
        [event.target.name]: event.target.value,
        activePage: 1
      },
      () => {
        exceptionServices
          .getItemsCount(
            this.state.tenantName.trim(),
            this.state.userName.trim(),
            this.state.statusCode.trim()
          )
          .then(response => {
            this.setState(
              {
                itemCount: response.items.length
              },
              () => {
                exceptionServices
                  .getAll(
                    this.state.activePage,
                    this.state.itemsShown,
                    this.state.tenantName.trim(),
                    this.state.statusCode.trim(),
                    this.state.userName.trim()
                  )
                  .then(response => {
                    this.setState({
                      items: response.items.map(item => {
                        return item;
                      })
                    });
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            );
          })
          .catch(err => {
            console.log(err);
          });
      }
    );
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () =>
      exceptionServices
        .getAll(
          this.state.activePage,
          this.state.itemsShown,
          this.state.tenantName,
          this.state.statusCode,
          this.state.userName
        )
        .then(response => {
          this.setState({
            items: response.items.map(item => {
              return item;
            })
          });
        })
        .catch(err => {
          console.log(err);
        })
    );
  }

  updateReview(data) {}
  onClick() {
    let data = this.state.activeItem;
    data.reviewed = !this.state.activeItem.reviewed;
    exceptionServices
      .updateException(data)

      .then(response => {
        Notifier.success(
          "Error report viewed set to " + this.state.activeItem.reviewed
        );
      })
      .catch(err => {
        console.log(err);
        Notifier.error("Unable to apply change.");
      });
  }
  showItem(item) {
    this.setState({
      activeItem: item,
      modalShow: !this.state.modalShow,
      showCompose: true
    });
  }
  closeModal() {
    this.setState({
      showCompose: false,
      activeItem: {},
      modalShow: !this.state.modalShow
    });
  }
  render() {
    return (
      <React.Fragment>
        <div>
          <Ribbon breadcrumbArray={["Exceptions Form"]} />
          <PageHeader
            iconClasses="fa fa-lg fa-fw fa-file"
            title="Exceptions Form"
          />
          <div className="container-fluid">
            <div className="panel-heading">
              <div className="panel-body status">
                <div className="row">
                  <section
                    style={{ display: "inline", marginLeft: "1%" }}
                    className="col col-3"
                  >
                    <label className="input">
                      {" "}
                      <strong>Tenant Name</strong>
                      <span> </span>
                      <input
                        type="text"
                        name="tenantName"
                        value={this.state.tenantName}
                        onChange={this.onChange}
                      />
                    </label>
                  </section>
                  <section
                    style={{ display: "inline", marginLeft: "1%" }}
                    className="col col-3"
                  >
                    <label className="input">
                      {" "}
                      <strong>User Name</strong>
                      <span> </span>
                      <input
                        type="text"
                        name="userName"
                        value={this.state.userName}
                        onChange={this.onChange}
                      />
                    </label>
                  </section>
                  <section
                    style={{ display: "inline", marginLeft: "1%" }}
                    className="col col-3"
                  >
                    <label className="input">
                      {" "}
                      <strong>Status Code</strong>
                      <span> </span>
                      <input
                        type="number"
                        name="statusCode"
                        value={this.state.statusCode}
                        onChange={this.onChange}
                      />
                    </label>
                  </section>
                </div>
              </div>
            </div>
            {this.state.items.length > 0 ? (
              <div className="panel-heading">
                <div className="panel-body status">
                  <div>
                    <div>
                      <div>
                        <table className="table table-striped table-bordered table-hover">
                          <thead>
                            <tr>
                              <th>
                                <a>Method</a>
                              </th>
                              <th>
                                <a>Status Code</a>
                              </th>

                              <th>
                                <a>Error Time</a>
                              </th>
                              <th>
                                <a>User</a>
                              </th>
                              <th>
                                <a>Reviewed</a>
                              </th>
                              <th>
                                <a>Status Message</a>
                              </th>
                              <th>
                                <a>Tenant</a>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.items.map(item => {
                              return (
                                <tr
                                  style={{ height: "5%" }}
                                  key={item._id}
                                  onClick={() => this.showItem(item)}
                                >
                                  <td>{item.method}</td>
                                  <td>{item.statusCode}</td>
                                  <td>
                                    {moment(item.errorTime).format("lll")}
                                  </td>
                                  <td>
                                    {item.userFirstName +
                                      " " +
                                      item.userLastName}
                                  </td>
                                  <td>{item.reviewed ? "Yes" : "No"}</td>
                                  <td>{item.statusMessage}</td>
                                  <td>{item.tenantName}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div style={{ textAlign: "center" }}>
              <Pagination
                prevPageText="prev"
                nextPageText="next"
                firstPageText="First"
                lastPageText="Last"
                activePage={this.state.activePage}
                onChange={this.handlePageChange}
                itemsCountPerPage={this.state.itemsShown}
                totalItemsCount={this.state.itemCount}
              />
            </div>

            {this.state.modalShow ? (
              <Modal show={this.state.modalShow} onHide={this.closeModal}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <strong>Error Report: </strong> {this.state.activeItem._id}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <FormGroup controlId="formControlsSelect">
                    <FormGroup />
                    <p>
                      <strong>Status Message:</strong>{" "}
                      {this.state.activeItem.statusMessage}
                    </p>
                    <p>
                      <strong>Status Code:</strong>{" "}
                      {this.state.activeItem.statusCode}
                    </p>
                    <p>
                      <strong>Method:</strong> {this.state.activeItem.method}
                    </p>
                    <p>
                      <strong>URL:</strong> {this.state.activeItem.url}
                    </p>
                    <p>
                      <strong>Error Time:</strong>{" "}
                      {/* {moment(this.state.activeItem.errorTime).format("lll")} */}
                      {this.state.activeItem.errorTime}
                    </p>
                    <p>
                      <strong>Tenant Name:</strong>{" "}
                      {this.state.activeItem.tenantName}
                    </p>
                    <p>
                      <strong>User Name:</strong>{" "}
                      {this.state.activeItem.userFirstName +
                        " " +
                        this.state.activeItem.userLastName}
                    </p>
                    <div>
                      <strong>Body: </strong>
                      <ul>
                        {Object.entries(this.state.activeItem.body).map(
                          ([key, value]) => {
                            return (
                              <li key={key}>
                                <strong>{key}</strong>: {value}
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                    <Checkbox
                      defaultChecked={this.state.activeItem.reviewed}
                      onClick={this.onClick}
                    >
                      Reviewed
                    </Checkbox>
                  </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.closeModal}>Close</Button>
                </Modal.Footer>
              </Modal>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default ExceptionsForm;
