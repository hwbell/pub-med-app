import React from 'react';
import '../App.css';
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

    this.state = {
      results: null

    };
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
          }

          return (
            <Button key={i} className={buttonClass} size="sm"
              onClick={() => button.onClick(this.props.article, this.props.collection)}>{button.text}</Button>
          )
        })}

      </div>
    )
  }

  render() {
    return (
      <div className="article-result">

        <div style={styles.top}>
          
          <p className="article-title">{this.props.article.title}</p>
          <p className="article-title">{this.props.article.authorString}</p>
          <p className="article-title">
            {`${this.props.article.journalTitle}  `}
            <strong>{`  ${this.props.article.pubYear}`}</strong>
          </p>
        
        </div>

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
  }

}

export default ArticleResult;
