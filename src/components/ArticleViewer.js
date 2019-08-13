import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

// this form is toggled visible by the 'add to collection' button on the search page
class ArticleViewer extends React.Component {
  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
  }

  renderArticlePreview() {
    let { title, pmcid, pmid, authorString, journalInfo, abstractText, keywordList, fullTextUrlList, pubYear } = this.props.article;


    // authors, date, journal, keywords as subtitles with values below
    let headings = [
      {
        name: 'Authors',
        text: authorString
      },
      {
        name: 'Date Published',
        text: !!journalInfo ? journalInfo.printPublicationDate : pubYear
      },
      {
        name: 'Journal',
        text: !!journalInfo ? journalInfo.journal.title : ''
      },
      {
        name: 'Keywords',
        text: !!keywordList ? keywordList.keyword.join(', ') : ''
      },
      {
        name: 'Abstract',
        text: !!abstractText ? abstractText : ''
      }
    ]

    let ids = [
      {
        name: 'PMID',
        text: pmid
      },
      {
        name: 'PMCID',
        text: pmcid
      }
    ];

    // get urls for the article availablitity if we have them
    let urlList;
    if (fullTextUrlList && fullTextUrlList.fullTextUrl.length > 0) {
      urlList = fullTextUrlList.fullTextUrl.map((articleObj) => {
        // console.log(articleObj)
        let { availabilityCode, url } = articleObj;
        return {
          availabilityCode,
          url
        }
      })
    } else {
      urlList = [];
    }

    return (
      <div className="">

        <Button color="link" className="float-right nav-link" onClick={this.props.toggle}>
          <i className="fas fa-times"></i>
        </Button>

        <p className="preview-title">
          {title}
        </p>

        {/* render the headings / text we have values for */}
        {headings.map((heading, i) => {

          if (!!heading.name && !!heading.text) {
            return (
              <div key={i}>
                <p className="preview-subtitle">{heading.name}</p>
                <p className="preview-text">{heading.text}</p>
              </div>
            )
          } else {
            return null;
          }

        })}

        {/* render the links to the article. They'll link externally to the pdf / access information */}
        {urlList.length > 0 &&
          <div>

            <p className="preview-subtitle">Full Text:</p>

            <div>
              {urlList.map((link, i) => {

                // demand code and link
                if (!!link.availabilityCode && !!link.url) {
                  // set fa class to book or dollar sign
                  let iconClass = link.availabilityCode === 'OA' ? 'fas fa-book-open' : 'fas fa-dollar-sign';

                  return (
                    <a key={i} target="_blank" href={link.url}>
                      <i className={`${iconClass} preview-link`}></i>
                    </a>
                  )

                } else {
                  return null;
                }
              })}
            </div>

          </div>}


        {/* render the identifiers we have values for */}
        <div className="float-right">
          {ids.map((id, i) => {

            if (!!id.name && !!id.text) {
              return (
                <p key={i} className="preview-subtitle">{`${id.name}: ${id.text}`}</p>
              )
            } else {
              return null;
            }
          })}
        </div>
      </div>
    )
  }

  closeModal() {
    this.props.toggle();
  }

  render() {
    // console.log(this.props.article)

    return (
      <Modal contentClassName="outline preview" size="xl" centered={true}
        style={styles.modal}
        isOpen={this.props.isVisible}
        toggle={this.props.toggle}>

        {/* <ModalHeader toggle={this.props.toggle}>Your Collections</ModalHeader> */}
        <ModalBody style={{ margin: '10px', marginBottom: '0px' }}>

          {this.renderArticlePreview()}

        </ModalBody>

      </Modal>

    );
  }
}

const styles = {
  content: {
    height: '100%',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export default ArticleViewer;
