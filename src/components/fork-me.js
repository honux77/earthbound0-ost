const ForkMe = ({first}) => {
    if (!first) return;

    return (
        <div className="ForkMe">
            <a href="https://github.com/honux77/earthbound0-ost">
                <img loading="lazy" width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_red_aa0000.png?resize=149%2C149" className="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1" />
            </a>
        </div>
    );

};

export default ForkMe;