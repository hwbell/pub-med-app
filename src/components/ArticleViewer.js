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

    // get urls for the article availablitity
    let urlList = fullTextUrlList.fullTextUrl.map((articleObj) => {
      console.log(articleObj)
      let { availabilityCode, url } = articleObj;
      return {
        availabilityCode,
        url
      }
    })

    return (
      <div className="">

        <Button color="link" className="float-right nav-link" onClick={this.props.toggle}>
          <i className="fas fa-times"></i>
        </Button>

        <p style={styles.title}>
          {title}
        </p>

        {/* render the headings we have values for */}
        {headings.map((heading, i) => {

          if (!!heading.name && !!heading.text) {
            return (
              <div key={i}>
                <p style={styles.subtitle}>{heading.name}</p>
                <p style={styles.text}>{heading.text}</p>
              </div>
            )
          } else {
            return null;
          }

        })}

        {/* render the links to the article. They'll link externally to the pdf / access information */}
        <div>

          <p style={styles.subtitle}>Full Text:</p>

          <div>
            {urlList.map((link, i) => {

              // demand code and link
              if (!!link.availabilityCode && !!link.url) {
                // set fa class
                let iconClass = link.availabilityCode === 'OA' ? 'fas fa-book-open' : 'fas fa-dollar-sign';

                return (
                  <a key={i} target="_blank" href={link.url}>
                    <i style={styles.icon} className={`${iconClass} article-link`}></i>
                  </a>
                )

              } else {
                return null;
              }
            })}
          </div>

        </div>


        {/* render the identifiers we have values for */}
        <div className="float-right">
          {ids.map((id, i) => {

            if (!!id.name && !!id.text) {
              return (
                <p key={i} style={styles.subtitle}>{`${id.name}: ${id.text}`}</p>
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
    console.log(this.props.article)

    return (
      <Modal size="xl" centered={true} isOpen={this.props.isVisible} toggle={this.props.toggle}>

        {/* <ModalHeader toggle={this.props.toggle}>Your Collections</ModalHeader> */}
        <ModalBody style={{ margin: '10px' }}>

          {this.renderArticlePreview()}


        </ModalBody>
        <ModalFooter>
          <Button color="secondary" size="sm" onClick={() => this.closeModal()}>close</Button>
        </ModalFooter>

      </Modal>

    );
  }
}

const styles = {
  content: {
    height: '100%',
  },
  title: {
    color: 'black',
    fontSize: '22px',
    marginTop: '10px'
  },
  subtitle: {
    margin: '0px',
    color: 'rgb(50,50,100)',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  text: {
    color: 'black',
    fontSize: '14px',
  },
}

export default ArticleViewer;
