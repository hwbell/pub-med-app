import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button } from 'reactstrap';
import ArticleResult from './ArticleResult';
import { PDFViewer } from '@react-pdf/renderer';
import GeneratedPdf from './GeneratedPdf';

// animation
import posed, { PoseGroup } from 'react-pose';

// pose containers
const Div = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

// ******************************************************************************
class Collection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPreview: false
    }

    this.togglePreview = this.togglePreview.bind(this);
    this.togglePostPreview = this.togglePostPreview.bind(this);
    
  }

  togglePreview() {
    this.setState({
      showPreview: !this.state.showPreview
    })
  }

  viewArticle(article) {
    console.log(`viewing article ${article.id}`)
  }

  togglePostPreview() {
    console.log(`posting ${this.props.collection.name} to server`)
  }

  renderResults(collection) {

    const collectionButtons = [
      {
        text: 'view article',
        onClick: this.viewArticle
      },
      {
        text: 'remove',
        onClick: this.props.handleSubmit
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

  render() {

    let collection = this.props.collection;

    return (
      <div className="outline collection" style={styles.content}>
        <div className="row" style={styles.titleHolder}>

          <div className="row">
            <p className="collection-title">
              <strong>{`${collection.name} `}</strong>
              {` [ ${collection.articles.length} ]`}
            </p>
          </div>

          {/* preview / download options for the article */}
          <div style={styles.buttonHolder}>
            <Button
              className="add article-button" size="sm"
              onClick={this.togglePreview}>
              {!this.state.showPreview ? 'make pdf' : 'hide pdf'}
            </Button>
            <Button
              className="add article-button" size="sm"
              onClick={this.togglePostPreview}>
              save to my collections
            </Button>

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

    );
  }
}

const styles = {
  buttonHolder: {
    padding: '10px'
  }
}

export default Collection;
