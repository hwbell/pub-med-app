import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import ArticleResult from '../ArticleResult';
import EmailForm from "../EmailForm";

import { ButtonGroup, Button } from 'reactstrap';
import Loader from 'react-loader-spinner';

import { PDFViewer } from '@react-pdf/renderer';
import GeneratedPdf from '../GeneratedPdf';

// animation
import posed, { PoseGroup } from 'react-pose';

// pose containers
const Div = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

const initialState = {
  pdfReady: false,
  showPreview: false,
  emailModal: false,
  exportSelected: true,
}

class CollectionPage extends React.Component {
  constructor(props) {
    super(props);

    this.renderLoader = this.renderLoader.bind(this);
    this.toggleEmailForm = this.toggleEmailForm.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = initialState;

  }

  componentDidMount() {
    this.setState({
      pdfReady: true
    })
  }

  renderLoader() {
    return (
      <Div style={styles.loaderHolder} key="loader">
        <Loader
          height={100}
          width={100}
          type="ThreeDots"
          color="whitesmoke"
        />
      </Div>
    )
  }

  renderResults(collection) {

    const collectionButtons = [
      {
        text: 'view article',
        onClick: this.viewArticle
      },
      {
        text: 'remove',
        onClick: this.handleSubmit
      }
    ];

    return collection.articles.map((article, i) => {
      return (
        <ArticleResult key={i}
          collection={collection}
          article={article}
          buttons={collectionButtons} />
      )
    })

  }

  // for removing articles. submit registers the removal in App
  handleSubmit(article, collection) {
    console.log(`removing article: ${article.id} from user's ${collection.name} collection`);

    this.props.modifyCollection(article, collection.name, -1, () => {
      console.log('article removed from collection')
    })

  }

  viewArticle(article) {
    console.log(`Viewing article: ${article.id}`)
  }

  toggleEmailForm() {
    this.setState(prevState => ({
      emailModal: !prevState.emailModal
    }));
  }

  togglePreview() {
    this.setState(prevState => ({
      showPreview: !prevState.showPreview
    }));
  }

  render() {

    return (
      <div className="search-page page">

        {this.state.exportSelected &&
          <EmailForm
            collection={this.state.selectedCollection}
            isVisible={this.state.emailModal}
            toggle={this.toggleEmailForm}
            collections={this.props.collections} />}

        <div className="glass">

          {/* the header */}
          <Header
            class="heading"
            title={"PMC Collections"}
            subtitle={"create & share lists of resources"}
          />

          {/* results */}

          {/* the collections when they appear */}
          {this.props.collections.length > 0 ?

            this.props.collections.map((collection, i) => {

              return (
                <div key={i} className="outline" style={styles.content}>
                  <div className="row" style={styles.titleHolder}>

                    <div className="row">
                      <p className="collection-title">
                        <strong>{`${collection.name} `}</strong>
                        {` [ ${collection.articles.length} ]`}
                      </p>
                    </div>

                    {/* email / download options for the article */}
                    <div style={styles.buttonHolder}>
                      <Button
                        className="add article-button" size="sm"
                        onClick={this.togglePreview}>
                        {!this.state.showPreview ? 'preview' : 'hide preview'}
                      </Button>
                      
                      {/* <Button className="add" size="sm"
                        onClick={() => this.toggleEmailForm()}>
                        email
                      </Button> */}

                      {/* {this.state.pdfReady &&
                        <Button className="add article-button" size="sm">
                          <PDFDownloadLink style={{ color: 'white', textDecoration: 'none' }} document={<GeneratedPdf collection={collection} />} fileName="somename.pdf">
                            {({ blob, url, loading, error }) => (loading ? 'loading...' : 'download')}
                          </PDFDownloadLink>
                        </Button>} */}

                    </div>
                  </div>

                  {this.state.showPreview &&
                    <Div className="pdf-holder">
                      <PDFViewer className="pdf-viewer">
                        <GeneratedPdf collection={collection} />
                      </PDFViewer>
                    </Div>}


                  {this.renderResults(collection)}

                </div>
              )

            })

            // or if there aren't any collections yet
            :
            <div className="outline" style={styles.content}>
              <p className="paragraph">
                {`It looks like you haven't made any collections yet! You can add
                articles by searching the database, then organize, share & export them here. `}
              </p>
            </div>}




        </div>
      </div>
    );
  }
}

const styles = {
  main: {
    width: '100%'
  },
  titleHolder: {
    width: '100%',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.24)'
  },
  buttonHolder: {
    padding: '10px'
  }
}

export default CollectionPage;
