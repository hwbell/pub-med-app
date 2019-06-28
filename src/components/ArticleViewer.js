import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button, ButtonGroup, Input, Form, InputGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


// this form is toggled visible by the 'add to collection' button on the search page
class ArticleViewer extends React.Component {
  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.toggleCollectionForm = this.toggleCollectionForm.bind(this);
  }

  componentDidMount() {
    // 
  }

  renderArticlePreview() {
    let { title, pmcid, pmid, authorString, journalInfo, abstractText, keywordList, fullTextUrlList } = this.props.article;

    // get rid of any that are undefined
    let subtitles = [authorString, journalInfo, keywordList].filter(data => !!data)

    // authors, date, journal, keywords as subtitles with values below
    let headings = [
      {
        name: 'Authors',
        text: authorString
      },
      {
        name: 'Date Published',
        text: journalInfo.printPublicationDate
      },
      {
        name: 'Journal',
        text: journalInfo.journal.title
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

    return (
      <div className="">

        <Button color="link" className="float-right nav-link" onClick={this.props.toggle}>
          <i className="fas fa-times"></i>
        </Button>

        <p style={styles.title}>
          {title}
        </p>

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

      </div>
    )
  }

  toggleCollectionForm() {
    console.log('toggling AddForm')
    this.setState(prevState => ({
      collectionModal: !prevState.collectionModal
    }));
  }

  closeModal() {
    this.props.toggle();
  }

  render() {

    return (
      <Modal size="xl" centered={true} isOpen={this.props.isVisible} toggle={this.props.toggle}>

        {/* <ModalHeader toggle={this.props.toggle}>Your Collections</ModalHeader> */}
        <ModalBody style={{margin: '10px'}}>

          {this.renderArticlePreview()}


        </ModalBody>
        <ModalFooter>
          <Button color="secondary" size="sm" onClick={() => this.closeModal()}>close</Button>
          <Button color="secondary" size="sm" onClick={() => this.closeModal()}>closer</Button>

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
    fontSize: '16px',
  },

}

export default ArticleViewer;
