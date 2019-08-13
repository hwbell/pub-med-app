import React from 'react';
import '../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button } from 'reactstrap';


// ******************************************************************************
// this component is made to display just the article title and associated buttons
// it should be given props for the article itself and the buttons to display --->
// 'view article', and either 'add to collection' OR 'remove' depending on the context
class ArticleResult extends React.Component {
  constructor(props) {
    super(props);

    this.renderIndicators = this.renderIndicators.bind(this);
  }

  renderIndicators() {
    let { article } = this.props;
    let { fullTextUrlList } = article;

    if ( !fullTextUrlList || !fullTextUrlList.fullTextUrl ||  !fullTextUrlList.fullTextUrl.length > 0 ) {
      return null;
    }

    let urlList;
    urlList = fullTextUrlList.fullTextUrl.map((articleObj) => {
      let { availabilityCode, url } = articleObj;
      return {
        availabilityCode,
        url
      }
    })

    return (

      <div style={styles.indicatorsHolder} className="indicators">
        {fullTextUrlList.fullTextUrl.map((item, i) => {
            let iconClass = item.availabilityCode === 'OA' ? 'fas fa-book-open' : 'fas fa-dollar-sign';
            return <i key={i} className={iconClass} style={styles.icon}></i>
          })}
      </div>
    )
  }

  renderText() {

    let { title, authorString, journalInfo, pubYear } = this.props.article;
    let { index } = this.props;
    return (
      <div style={styles.top}>

        <p className="article-title">{`${index}.    ${title}`}</p>

        <p className="article-text">{authorString}</p>

        {journalInfo && journalInfo.journal ?
          <p className="article-text">
            {`${this.props.article.journalInfo.journal.title}  `}
            <strong>{`  ${pubYear}`}</strong>
          </p> :
          <p className="article-text">
            <strong>{`  ${pubYear}`}</strong>
          </p>}

      </div>
    )
  }

  renderButtons() {
    return (
      <div style={styles.buttonsHolder}>

        {/* the provided buttons & click functions */}
        {this.props.buttons.map((button, i) => {

          let buttonClass = 'article-button';

          if (button.text === 'remove') {
            buttonClass += ` warn`;
          } else if (button.text === 'add to collection') {
            buttonClass += ` add`;
          } else {
            buttonClass += ` view`;
          }

          return (
            <Button key={i} className={buttonClass} size="sm"
              onClick={() => button.onClick(this.props.article, this.props.collection, -1)}>{button.text}</Button>
          )
        })}

      </div>
    )
  }

  render() {

    return (
      <div className="article-result">

        {/* icons telling the user if full text/ etc is available */}
        {this.renderIndicators()}

        {/* the title / author / journal info */}
        {this.renderText()}

        {/* the action buttons */}
        {this.renderButtons()}


      </div>
    );
  }
}

const styles = {
  buttonsHolder: {
    marginLeft: '15px',
    alignSelf: 'flex-start'
  },
  top: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start'
  },
  indicatorsHolder: {
    position: 'absolute',
    right: '20px',
    bottom: '10px',
    zIndex: 10,
    padding: '10px',
  },
  icon: {
    fontSize: '12px', 
    color: 'white',
    margin: '4px'
  }
}

export default ArticleResult;
