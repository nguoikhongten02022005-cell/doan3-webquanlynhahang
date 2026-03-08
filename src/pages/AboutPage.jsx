function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <span className="about-label">Câu Chuyện Của Chúng Tôi</span>
            <h1 className="about-hero-title">
              Nơi Hương Vị<br />
              <span className="about-title-italic">Kể Chuyện</span>
            </h1>
            <p className="about-hero-subtitle">
              Từ năm 2015, chúng tôi bắt đầu hành trình mang đến những trải nghiệm ẩm thực
              chân thực và đầy cảm xúc cho mọi thực khách.
            </p>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <h2 className="about-section-title">Hành Trình Của Chúng Tôi</h2>
              <div className="about-text">
                <p>
                  Từ năm 2015, chúng tôi bắt đầu hành trình mang đến những trải nghiệm ẩm thực
                  chân thực và đầy cảm xúc. Mỗi món ăn không chỉ là sự kết hợp của nguyên liệu
                  tươi ngon, mà còn là tâm huyết của đội ngũ đầu bếp dày dạn kinh nghiệm.
                </p>
                <p>
                  Chúng tôi tin rằng bữa ăn ngon nhất là khi được chia sẻ cùng những người thân yêu.
                  Không gian ấm cúng, phong cách phục vụ tận tâm và thực đơn đa dạng - tất cả được
                  thiết kế để bạn cảm thấy như đang ở nhà.
                </p>
                <p>
                  Với hơn 11 năm kinh nghiệm, chúng tôi đã phục vụ hơn 50,000 khách hàng hài lòng
                  và không ngừng đổi mới thực đơn với hơn 200 món ăn đa dạng từ Á đến Âu.
                </p>
              </div>
            </div>

            <div className="about-visual">
              <div className="about-image-stack">
                <div className="about-image about-image-1">
                  <div className="about-image-placeholder about-img-chef"></div>
                  <span className="about-image-caption">Đầu bếp của chúng tôi</span>
                </div>
                <div className="about-image about-image-2">
                  <div className="about-image-placeholder about-img-dish"></div>
                  <span className="about-image-caption">Món ăn được chế biến tỉ mỉ</span>
                </div>
                <div className="about-image about-image-3">
                  <div className="about-image-placeholder about-img-space"></div>
                  <span className="about-image-caption">Không gian ấm cúng</span>
                </div>
              </div>

              <div className="about-quote">
                <svg className="quote-icon" width="40" height="32" viewBox="0 0 40 32" fill="none">
                  <path d="M0 32V16C0 7.168 4.8 0 16 0v8c-4.8 0-8 2.4-8 8h8v16H0zm24 0V16c0-8.832 4.8-16 16-16v8c-4.8 0-8 2.4-8 8h8v16H24z" fill="currentColor"/>
                </svg>
                <p className="quote-text">
                  Ẩm thực không chỉ là món ăn, mà là nghệ thuật kết nối con người với nhau
                </p>
                <p className="quote-author">— Chef Nguyễn Minh Tuấn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-row">
            <div className="about-stat-item">
              <strong className="about-stat-number">11+</strong>
              <span className="about-stat-label">Năm Kinh Nghiệm</span>
            </div>
            <div className="about-stat-item">
              <strong className="about-stat-number">50K+</strong>
              <span className="about-stat-label">Khách Hàng Hài Lòng</span>
            </div>
            <div className="about-stat-item">
              <strong className="about-stat-number">200+</strong>
              <span className="about-stat-label">Món Ăn Đa Dạng</span>
            </div>
            <div className="about-stat-item">
              <strong className="about-stat-number">4.9/5</strong>
              <span className="about-stat-label">Đánh Giá Trung Bình</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <div className="section-head center">
            <h2>Giá Trị Cốt Lõi</h2>
            <p>Những nguyên tắc định hướng mọi hoạt động của chúng tôi</p>
          </div>

          <div className="about-features">
            <div className="about-feature">
              <div className="about-feature-icon">🌿</div>
              <div className="about-feature-text">
                <h4>Nguyên Liệu Tươi Mỗi Ngày</h4>
                <p>Chọn lọc từ các nguồn cung cấp uy tín, đảm bảo chất lượng tốt nhất cho mỗi món ăn</p>
              </div>
            </div>
            <div className="about-feature">
              <div className="about-feature-icon">👨‍🍳</div>
              <div className="about-feature-text">
                <h4>Đầu Bếp Chuyên Nghiệp</h4>
                <p>Đội ngũ đầu bếp giàu kinh nghiệm, đam mê và sáng tạo không ngừng trong từng món ăn</p>
              </div>
            </div>
            <div className="about-feature">
              <div className="about-feature-icon">❤️</div>
              <div className="about-feature-text">
                <h4>Phục Vụ Tận Tâm</h4>
                <p>Mỗi khách hàng đều được chăm sóc chu đáo như người thân trong gia đình</p>
              </div>
            </div>
            <div className="about-feature">
              <div className="about-feature-icon">🏆</div>
              <div className="about-feature-text">
                <h4>Chất Lượng Hàng Đầu</h4>
                <p>Cam kết mang đến trải nghiệm ẩm thực đẳng cấp với tiêu chuẩn cao nhất</p>
              </div>
            </div>
            <div className="about-feature">
              <div className="about-feature-icon">🌍</div>
              <div className="about-feature-text">
                <h4>Bền Vững & Trách Nhiệm</h4>
                <p>Ưu tiên nguồn gốc bền vững và đóng góp tích cực cho cộng đồng địa phương</p>
              </div>
            </div>
            <div className="about-feature">
              <div className="about-feature-icon">✨</div>
              <div className="about-feature-text">
                <h4>Đổi Mới Liên Tục</h4>
                <p>Không ngừng sáng tạo và cập nhật thực đơn để mang đến trải nghiệm mới mẻ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="container">
          <div className="section-head center">
            <h2>Đội Ngũ Của Chúng Tôi</h2>
            <p>Những con người tài năng đứng sau mỗi món ăn ngon</p>
          </div>

          <div className="team-grid">
            <div className="team-member">
              <div className="team-member-photo team-photo-1"></div>
              <h3 className="team-member-name">Chef Nguyễn Minh Tuấn</h3>
              <p className="team-member-role">Bếp Trưởng</p>
              <p className="team-member-bio">15 năm kinh nghiệm, từng làm việc tại các nhà hàng 5 sao</p>
            </div>

            <div className="team-member">
              <div className="team-member-photo team-photo-2"></div>
              <h3 className="team-member-name">Trần Thị Hương</h3>
              <p className="team-member-role">Quản Lý Nhà Hàng</p>
              <p className="team-member-bio">Chuyên gia về trải nghiệm khách hàng và vận hành</p>
            </div>

            <div className="team-member">
              <div className="team-member-photo team-photo-3"></div>
              <h3 className="team-member-name">Lê Văn Đức</h3>
              <p className="team-member-role">Sous Chef</p>
              <p className="team-member-bio">Chuyên môn về ẩm thực Âu và món fusion sáng tạo</p>
            </div>

            <div className="team-member">
              <div className="team-member-photo team-photo-4"></div>
              <h3 className="team-member-name">Phạm Thu Hà</h3>
              <p className="team-member-role">Pastry Chef</p>
              <p className="team-member-bio">Nghệ nhân bánh ngọt với đam mê tạo nên những tác phẩm nghệ thuật</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
