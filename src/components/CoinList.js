import React from 'react';
import { connect } from 'react-redux';
import { fetchCoins } from '../actions';
import { setPage } from '../actions';
import { Link } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import moreIcon from '../styles/icons/more.svg';
import { Container } from '@mui/material';

class CoinList extends React.Component {


    constructor(props) {
        super(props)
        this.myRef = React.createRef()  
    }

    pageLength = 25;

    componentDidMount() {
        if (this.props.page === 1 && this.props.coins.length > 0) return

        this.props.fetchCoins(this.props.page);
    }  

    executeScroll = () => {
        if (!this.myRef.current) return;
        this.myRef.current.scrollIntoView({behavior: "smooth"})
    }

    componentDidUpdate(prevProps) {
        if (this.props.page !== prevProps.page && this.props.page !== 1) this.props.fetchCoins(this.props.page);   
        
        if (this.props.page !== 1) this.executeScroll();    
    }


    renderList() {
        let coins = this.props.coins;
        const rowRef = (index) => {
            if (this.pageLength*this.props.page-1 === index ) return this.myRef;
        }

        if (!coins) {
            return(
                <div>loading...</div>
            )
        }

        const setColor = (isPos) => {
            if (!isPos) return 'negative'
            
            return 'positive';
        }

        return (
            <div >
                <div className="list-header">
                    <span className="separator"></span>
                    <Container maxWidth="lg" className="sticky-header">
                            <div className="table">
                                <div className="table-row table-head">
                                    <div className="table-cell icon-cell" component="th" scope="row">symbol</div>
                                    <div className="table-cell" align="right">name</div>
                                    <div className="table-cell" align="right">current price</div>
                                    <div className="table-cell" align="right">24hr high</div>
                                    <div className="table-cell" align="right">24hr low</div>
                                    <div className="table-cell" align="right">24hr change%</div>
                                </div>
                            </div>
                    </Container>
                </div>                
                <div className="table-wrapper">                
                <Paper>
                    <div className="table" aria-label="List of Crypro Coins">
                        {coins.map((coin, index) => (                        
                            <Link to={`/${coin.id}`} className="table-row coin-list-item row-link"
                                key={coin.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                ref={rowRef(index)}
                            >
                                <div className="table-cell icon-cell" component="th" scope="row"><Avatar alt={coin.name} src={coin.image} />
                                </div>
                                <div className="table-cell" align="right">{coin.name}</div>
                                <div className="table-cell" align="right">{`$${coin.current_price}`}</div>
                                <div className="table-cell" align="right">{`$${coin.high_24h}`}</div>
                                <div className="table-cell" align="right">{`$${coin.low_24h}`}</div>
                                <div className={`table-cell  ${setColor(coin.price_change_percentage_24h >= 0)}`} align="right">{coin.price_change_percentage_24h}</div>
                        </Link>                        
                            
                        ))}
                    </div>
                    <div className="list-footer">
                        <button 
                            className="more-button" 
                            title="Browse more coins"
                            onClick={()=> {this.props.setPage(this.props.page+1)}}>
                            <img className="more-icon" src={moreIcon} />
                        </button>
                    </div>
                </Paper>
            </div>


            </div>
            
        )
    }

    render() {
        return this.renderList();
    }
}

const mapStateToProps = state => {
    return { 
        coins: state.coins,
        page: state.page    
    };
}

export default connect(
    mapStateToProps, 
    { fetchCoins, setPage }
)(CoinList);